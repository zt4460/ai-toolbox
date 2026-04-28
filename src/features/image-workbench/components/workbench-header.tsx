import Link from 'next/link';
import { Coins, FolderOpen, UserCircle } from 'lucide-react';

interface WorkbenchHeaderProps {
  credits?: number;
  displayName?: string;
  onCreditsClick?: () => void;
  onProfileClick?: () => void;
}

export function WorkbenchHeader({ credits = 0, displayName, onCreditsClick, onProfileClick }: WorkbenchHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-500">AI 工具箱</p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-900">图片创作工作台</h1>
          <p className="mt-1 text-sm text-gray-500">专注图片生成、资产管理和积分账户的精简版本。</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCreditsClick}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
          >
            <Coins className="h-4 w-4 text-amber-500" />
            {credits} 积分
          </button>
          <Link href="/assets" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50">
            <FolderOpen className="h-4 w-4" />
            资产库
          </Link>
          <button
            type="button"
            onClick={onProfileClick}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm text-white transition hover:bg-gray-800"
          >
            <UserCircle className="h-4 w-4" />
            {displayName || '登录 / 个人中心'}
          </button>
        </div>
      </div>
    </header>
  );
}
