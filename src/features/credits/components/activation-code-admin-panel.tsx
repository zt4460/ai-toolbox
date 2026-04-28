import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ActivationCodeRecord } from '@/features/credits/hooks/use-activation-code-admin';

interface ActivationCodeAdminPanelProps {
  records: ActivationCodeRecord[];
  statusFilter: 'all' | 'unused' | 'used' | 'disabled';
  onStatusFilterChange: (value: 'all' | 'unused' | 'used' | 'disabled') => void;
  loading: boolean;
  submitting: boolean;
  message: { type: 'success' | 'error' | ''; text: string };
  onCreateSingle: (payload: { code: string; cardType: string; points: number; days: number; price: number; expiresAt: string }) => Promise<unknown>;
  onCreateBatch: (payload: { cardType: string; points: number; count: number; days: number; price: number; expiresAt: string }) => Promise<unknown>;
  onRevoke: (id: string) => Promise<void>;
  onCopyCode: (code: string) => Promise<void>;
  onCopyCurrentRecords: () => Promise<void>;
  onExportCurrentRecords: () => void;
}

export function ActivationCodeAdminPanel({
  records,
  statusFilter,
  onStatusFilterChange,
  loading,
  submitting,
  message,
  onCreateSingle,
  onCreateBatch,
  onRevoke,
  onCopyCode,
  onCopyCurrentRecords,
  onExportCurrentRecords,
}: ActivationCodeAdminPanelProps) {
  const [singleCode, setSingleCode] = useState('');
  const [singleCardType, setSingleCardType] = useState('promo');
  const [singlePoints, setSinglePoints] = useState('100');
  const [singleDays, setSingleDays] = useState('0');
  const [singlePrice, setSinglePrice] = useState('0');
  const [singleExpiresAt, setSingleExpiresAt] = useState('');

  const [batchCardType, setBatchCardType] = useState('promo');
  const [batchPoints, setBatchPoints] = useState('100');
  const [batchCount, setBatchCount] = useState('10');
  const [batchDays, setBatchDays] = useState('0');
  const [batchPrice, setBatchPrice] = useState('0');
  const [batchExpiresAt, setBatchExpiresAt] = useState('');

  const getStatusBadge = (record: ActivationCodeRecord) => {
    if (record.isDisabled) {
      return <Badge variant="destructive">已作废</Badge>;
    }

    if (record.isUsed) {
      return <Badge variant="secondary">已使用</Badge>;
    }

    if (record.expiresAt) {
      return <Badge className="border-orange-200 bg-orange-50 text-orange-700">有过期时间</Badge>;
    }

    return <Badge className="border-green-200 bg-green-50 text-green-700">未使用</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">单个创建卡密</h2>
        <p className="mt-1 text-sm text-gray-500">适合手动创建单条卡密。每个字段都写清楚了，不需要你自己猜含义。</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="single-code">卡密内容</Label>
            <Input id="single-code" value={singleCode} onChange={(event) => setSingleCode(event.target.value)} placeholder="留空则自动生成" />
            <p className="text-xs text-gray-500">这串字符就是最终发给用户输入的激活码。你不想自己起名字的话，直接留空就行，系统会自动生成。</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="single-card-type">卡密类型</Label>
            <Input id="single-card-type" value={singleCardType} onChange={(event) => setSingleCardType(event.target.value)} placeholder="例如：体验卡 / 活动卡 / 月卡" />
            <p className="text-xs text-gray-500">这是给你自己区分用途的名字。比如你可以填“体验卡”“活动卡”“月卡”。</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="single-points">积分</Label>
            <Input id="single-points" value={singlePoints} onChange={(event) => setSinglePoints(event.target.value)} placeholder="例如 100" type="number" />
            <p className="text-xs text-gray-500">这里填多少，用户激活后就会增加多少积分。比如填 100，用户就会加 100 分。</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="single-days">天数</Label>
            <Input id="single-days" value={singleDays} onChange={(event) => setSingleDays(event.target.value)} placeholder="当前可先填 0" type="number" />
            <p className="text-xs text-gray-500">这个版本你如果不懂，直接填 0 就行。以后如果做会员时长，再用这个字段。</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="single-price">价格</Label>
            <Input id="single-price" value={singlePrice} onChange={(event) => setSinglePrice(event.target.value)} placeholder="不收费可填 0" type="number" />
            <p className="text-xs text-gray-500">这个是给你自己记账看的，前台用户看不到。如果这张卡不收费，直接填 0。</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="single-expires-at">过期时间</Label>
            <Input id="single-expires-at" value={singleExpiresAt} onChange={(event) => setSingleExpiresAt(event.target.value)} type="datetime-local" />
            <p className="text-xs text-gray-500">到了这个时间后，这张卡就不能再用了。不填的话，就表示这张卡一直有效。</p>
          </div>
        </div>
        <Button
          className="mt-4"
          disabled={submitting}
          onClick={() =>
            onCreateSingle({
              code: singleCode,
              cardType: singleCardType,
              points: Number(singlePoints),
              days: Number(singleDays),
              price: Number(singlePrice),
              expiresAt: singleExpiresAt,
            })
          }
        >
          创建单条卡密
        </Button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">批量生成卡密</h2>
        <p className="mt-1 text-sm text-gray-500">适合一次生成一批活动卡密。系统会自动生成卡密内容，你只需要填规则。</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="batch-card-type">卡密类型</Label>
            <Input id="batch-card-type" value={batchCardType} onChange={(event) => setBatchCardType(event.target.value)} placeholder="例如：活动卡 / 推广卡" />
            <p className="text-xs text-gray-500">这是这一整批卡密的用途名字，方便你以后自己查找和区分。</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="batch-points">积分</Label>
            <Input id="batch-points" value={batchPoints} onChange={(event) => setBatchPoints(event.target.value)} placeholder="例如 100" type="number" />
            <p className="text-xs text-gray-500">这里填多少，这一批里的每一条卡密激活后就都会加多少积分。</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="batch-count">数量</Label>
            <Input id="batch-count" value={batchCount} onChange={(event) => setBatchCount(event.target.value)} placeholder="例如 10" type="number" />
            <p className="text-xs text-gray-500">这里填几，就会一次生成几条卡密。比如填 10，就会生成 10 条。</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="batch-days">天数</Label>
            <Input id="batch-days" value={batchDays} onChange={(event) => setBatchDays(event.target.value)} placeholder="当前可先填 0" type="number" />
            <p className="text-xs text-gray-500">这个版本你如果不懂，直接填 0 就行。以后如果做会员时长，再用这个字段。</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="batch-price">价格</Label>
            <Input id="batch-price" value={batchPrice} onChange={(event) => setBatchPrice(event.target.value)} placeholder="不收费可填 0" type="number" />
            <p className="text-xs text-gray-500">这个是给你自己记账看的，前台用户看不到。如果这一批卡不收费，直接填 0。</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="batch-expires-at">过期时间</Label>
            <Input id="batch-expires-at" value={batchExpiresAt} onChange={(event) => setBatchExpiresAt(event.target.value)} type="datetime-local" />
            <p className="text-xs text-gray-500">到了这个时间后，这一批卡就不能再用了。不填的话，就表示它们一直有效。</p>
          </div>
        </div>
        <Button
          className="mt-4"
          disabled={submitting}
          onClick={() =>
            onCreateBatch({
              cardType: batchCardType,
              points: Number(batchPoints),
              count: Number(batchCount),
              days: Number(batchDays),
              price: Number(batchPrice),
              expiresAt: batchExpiresAt,
            })
          }
        >
          批量生成
        </Button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">卡密列表</h2>
            <p className="mt-1 text-sm text-gray-500">查看已经创建的卡密，按状态筛选，并对未使用卡密执行作废操作。</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button variant="outline" onClick={onCopyCurrentRecords} disabled={loading || records.length === 0}>
              复制当前列表
            </Button>
            <Button variant="outline" onClick={onExportCurrentRecords} disabled={loading || records.length === 0}>
              导出当前列表
            </Button>
            <Select value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as 'all' | 'unused' | 'used' | 'disabled')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="筛选状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="unused">未使用</SelectItem>
                <SelectItem value="used">已使用</SelectItem>
                <SelectItem value="disabled">已作废</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {message.text ? (
          <p className={`mt-4 text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{message.text}</p>
        ) : null}

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>卡密</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>积分</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>使用人</TableHead>
                <TableHead>使用时间</TableHead>
                <TableHead>过期时间</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center text-gray-400">加载中...</TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center text-gray-400">暂无卡密</TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.code}</TableCell>
                    <TableCell>{record.cardType}</TableCell>
                    <TableCell>{record.points}</TableCell>
                    <TableCell>{getStatusBadge(record)}</TableCell>
                    <TableCell>{record.usedBy || '-'}</TableCell>
                    <TableCell>{record.usedAt ? new Date(record.usedAt).toLocaleString() : '-'}</TableCell>
                    <TableCell>{record.expiresAt ? new Date(record.expiresAt).toLocaleString() : '-'}</TableCell>
                    <TableCell>{new Date(record.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => onCopyCode(record.code)}>
                          复制
                        </Button>
                        {!record.isUsed && !record.isDisabled ? (
                          <Button variant="outline" size="sm" disabled={submitting} onClick={() => onRevoke(record.id)}>
                            作废
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
