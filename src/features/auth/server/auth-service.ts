import bcrypt from 'bcryptjs';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { HttpError } from '@/lib/http/errors';
import { setSessionCookie } from '@/lib/auth/session';

export interface AuthUser {
  id: string;
  username?: string;
  email?: string;
  phone?: string;
  credits: number;
  is_active?: boolean;
  is_admin?: boolean;
  created_at: string;
  last_login_at?: string;
}

function isAdminIdentity(user: { email?: string | null; phone?: string | null; username?: string | null }) {
  const allowlist = (process.env.COZE_ADMIN_IDENTIFIERS || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (!allowlist.length) {
    return false;
  }

  return [user.email, user.phone, user.username].some((value) => value && allowlist.includes(value));
}

function resolveIdentifier(identifier: string) {
  const isEmail = identifier.includes('@');
  const isPhone = /^1[3-9]\d{9}$/.test(identifier);
  const username = !isEmail && !isPhone ? identifier : null;

  return { isEmail, isPhone, username };
}

export async function loginUser(identifier: string, password: string) {
  if (!identifier || !password) {
    throw new HttpError(400, '账号和密码不能为空');
  }

  const client = getSupabaseClient();
  const { isEmail, isPhone } = resolveIdentifier(identifier);

  let query = client
    .from('users')
    .select('id, username, email, phone, password_hash, credits, is_active, created_at, last_login_at');

  if (isEmail) {
    query = query.eq('email', identifier);
  } else if (isPhone) {
    query = query.eq('phone', identifier);
  } else {
    query = query.eq('username', identifier);
  }

  const { data: user, error } = await query.maybeSingle();

  if (error) {
    throw new HttpError(500, error.message);
  }

  if (!user) {
    throw new HttpError(401, '用户不存在');
  }

  if (!user.is_active) {
    throw new HttpError(403, '账号已被禁用');
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw new HttpError(401, '密码错误');
  }

  await client
    .from('users')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', user.id);

  await setSessionCookie(user.id);

  const userInfo = { ...user, is_admin: isAdminIdentity(user) };
  delete (userInfo as { password_hash?: string }).password_hash;
  return userInfo as AuthUser;
}

export async function getCurrentUser(userId: string) {
  const client = getSupabaseClient();
  const { data: user, error } = await client
    .from('users')
    .select('id, username, email, phone, credits, is_active, created_at, last_login_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new HttpError(500, error.message);
  }

  if (!user) {
    throw new HttpError(404, '用户不存在');
  }

  return {
    ...user,
    is_admin: isAdminIdentity(user),
  } as AuthUser;
}

export async function requireAdminUser(userId: string) {
  const user = await getCurrentUser(userId);

  if (!user.is_admin) {
    throw new HttpError(403, '无权限访问后台');
  }

  return user;
}

export async function registerUser(identifier: string, code: string, password: string, activationCode: string) {
  if (!identifier || !password || !code) {
    throw new HttpError(400, '账号、验证码和密码不能为空');
  }

  if (!activationCode) {
    throw new HttpError(400, '请输入激活码');
  }

  if (password.length < 6) {
    throw new HttpError(400, '密码至少需要6位');
  }

  const client = getSupabaseClient();
  const { isEmail, isPhone, username } = resolveIdentifier(identifier);

  let codeQuery = client
    .from('verification_codes')
    .select('*')
    .eq('code', code)
    .eq('used', false)
    .order('created_at', { ascending: false })
    .limit(1);

  if (isEmail) {
    codeQuery = codeQuery.eq('email', identifier);
  } else if (isPhone) {
    codeQuery = codeQuery.eq('phone', identifier);
  }

  const { data: codeRecord, error: codeError } = await codeQuery.maybeSingle();
  if (codeError) {
    throw new HttpError(500, codeError.message);
  }

  if (!codeRecord) {
    throw new HttpError(400, '验证码无效或已过期');
  }

  const codeTime = new Date(codeRecord.created_at).getTime();
  if (Date.now() - codeTime > 10 * 60 * 1000) {
    throw new HttpError(400, '验证码已过期，请重新获取');
  }

  await client.from('verification_codes').update({ used: true }).eq('id', codeRecord.id);

  let userQuery = client.from('users').select('id');
  if (isEmail) {
    userQuery = userQuery.eq('email', identifier);
  } else if (isPhone) {
    userQuery = userQuery.eq('phone', identifier);
  } else {
    userQuery = userQuery.eq('username', identifier);
  }

  const { data: existingUser } = await userQuery.maybeSingle();
  if (existingUser) {
    throw new HttpError(400, '该账号已被注册');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const insertData: Record<string, string> = {
    password_hash: passwordHash,
  };

  if (isEmail) {
    insertData.email = identifier;
  } else if (isPhone) {
    insertData.phone = identifier;
  } else if (username) {
    insertData.username = username;
  }

  const { data: newUser, error: insertError } = await client
    .from('users')
    .insert(insertData)
    .select('id, username, email, phone, credits, is_active, created_at, last_login_at')
    .single();

  if (insertError) {
    throw new HttpError(500, insertError.message);
  }

  let bonusCredits = 0;
  const { data: actCode } = await client
    .from('activation_codes')
    .select('*')
    .eq('code', activationCode)
    .eq('is_used', false)
    .maybeSingle();

  if (actCode && (!actCode.expires_at || new Date(actCode.expires_at) > new Date())) {
    bonusCredits = actCode.points || 0;

    if (bonusCredits > 0) {
      await client.from('users').update({ credits: bonusCredits }).eq('id', newUser.id);
      await client
        .from('activation_codes')
        .update({ is_used: true, used_by: newUser.id, used_at: new Date().toISOString() })
        .eq('id', actCode.id);
      await client.from('credit_transactions').insert({
        user_id: newUser.id,
        type: 'activation',
        amount: bonusCredits,
        balance_before: 0,
        balance_after: bonusCredits,
        source: 'activation_code',
        related_id: actCode.id,
        description: `激活码 ${activationCode} 激活`,
      });
    }
  }

  return {
    user: bonusCredits > 0 ? { ...newUser, credits: bonusCredits } : (newUser as AuthUser),
    message: bonusCredits > 0 ? `注册成功，获得${bonusCredits}积分` : '注册成功',
  };
}

export async function sendVerificationCode(identifier: string) {
  if (!identifier) {
    throw new HttpError(400, '请提供账号');
  }

  const { isEmail, isPhone } = resolveIdentifier(identifier);
  if (!isEmail && !isPhone) {
    throw new HttpError(400, '请输入有效的邮箱或手机号');
  }

  const client = getSupabaseClient();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const insertData: Record<string, string> = {
    code,
    type: 'register',
    expires_at: expiresAt,
  };

  if (isEmail) {
    insertData.email = identifier;
  } else {
    insertData.phone = identifier;
  }

  const { error } = await client.from('verification_codes').insert(insertData);
  if (error) {
    throw new HttpError(500, error.message);
  }

  return {
    message: process.env.COZE_PROJECT_ENV === 'DEV' ? '验证码已发送（开发模式：验证码会在控制台输出）' : '验证码已发送',
    devCode: process.env.COZE_PROJECT_ENV === 'DEV' ? code : undefined,
  };
}

export async function verifyCode(identifier: string, code: string) {
  if (!identifier || !code) {
    throw new HttpError(400, '请提供验证码');
  }

  const client = getSupabaseClient();
  const { isEmail, isPhone } = resolveIdentifier(identifier);

  let query = client
    .from('verification_codes')
    .select('*')
    .eq('code', code)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1);

  if (isEmail) {
    query = query.eq('email', identifier);
  } else if (isPhone) {
    query = query.eq('phone', identifier);
  } else {
    throw new HttpError(400, '请输入有效的邮箱或手机号');
  }

  const { data: verifyRecord, error } = await query.single();
  if (error || !verifyRecord) {
    throw new HttpError(400, '验证码无效或已过期');
  }

  await client.from('verification_codes').update({ used: true }).eq('id', verifyRecord.id);
}
