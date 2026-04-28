import { CoinsIcon, Loader2, TicketIcon } from 'lucide-react';

interface CreditHistoryItem {
  id: string;
  type: string;
  amount: number;
  description: string;
  created_at: string;
}

interface CreditsPanelProps {
  credits: number;
  transactions: CreditHistoryItem[];
  activationCode: string;
  onActivationCodeChange: (value: string) => void;
  onActivate: () => Promise<void> | void;
  activating: boolean;
  message: { type: string; text: string };
}

function getTransactionClass(type: string) {
  if (type === 'activation' || type === 'recharge') return 'text-green-600';
  if (type === 'consume') return 'text-red-600';
  return 'text-gray-600';
}

export function CreditsPanel({
  credits,
  transactions,
  activationCode,
  onActivationCodeChange,
  onActivate,
  activating,
  message,
}: CreditsPanelProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">当前积分</span>
          <div className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
            <CoinsIcon className="h-5 w-5 text-amber-500" />
            {credits}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-700">
          <TicketIcon className="h-4 w-4" />
          卡密激活
        </div>
        <div className="flex gap-3">
          <input
            value={activationCode}
            onChange={(event) => onActivationCodeChange(event.target.value)}
            placeholder="请输入卡密"
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400"
          />
          <button
            type="button"
            onClick={onActivate}
            disabled={activating}
            className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {activating ? <Loader2 className="h-4 w-4 animate-spin" /> : '激活'}
          </button>
        </div>
        {message.text ? (
          <p className={`mt-3 text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{message.text}</p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700">积分明细</h3>
        {transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">暂无积分记录</p>
        ) : (
          <div className="mt-4 space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <div>
                  <p className="text-sm text-gray-700">{transaction.description}</p>
                  <p className="mt-1 text-xs text-gray-400">{new Date(transaction.created_at).toLocaleString()}</p>
                </div>
                <span className={`text-sm font-medium ${getTransactionClass(transaction.type)}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
