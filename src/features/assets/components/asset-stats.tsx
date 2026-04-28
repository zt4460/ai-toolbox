interface AssetStatsProps {
  totalRecords: number;
  totalCredits: number;
  currentCredits?: number;
}

export function AssetStats({ totalRecords, totalCredits, currentCredits = 0 }: AssetStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">总记录数</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900">{totalRecords}</p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">总消耗积分</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900">{totalCredits}</p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">当前余额</p>
        <p className="mt-2 text-2xl font-semibold text-violet-600">{currentCredits}</p>
      </div>
    </div>
  );
}
