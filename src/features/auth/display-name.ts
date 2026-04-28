export interface DisplayNameUser {
  phone?: string;
  email?: string;
  username?: string;
}

export function getUserDisplayName(user?: DisplayNameUser | null, fallback = '登录 / 个人中心') {
  if (!user) {
    return fallback;
  }

  return user.phone || user.email || user.username || fallback;
}
