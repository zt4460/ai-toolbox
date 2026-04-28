interface ProfileSummaryProps {
  displayName: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

export function ProfileSummary({ displayName, email, phone, createdAt }: ProfileSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{displayName}</h2>
          <p className="mt-1 text-sm text-gray-500">{phone || email || '未绑定联系方式'}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">账户信息</h3>
        <div className="mt-4 space-y-3 text-sm text-gray-700">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span>手机号</span>
            <span>{phone || '未绑定'}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span>邮箱</span>
            <span>{email || '未绑定'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>注册时间</span>
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
