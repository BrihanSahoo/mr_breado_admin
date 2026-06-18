import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CreditCard, Download } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/admin/page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import { onlineTransactionsService } from '@/services/online-transactions.service';

export const Route = createFileRoute('/online-transactions')({
  head: () => ({ meta: [{ title: 'Online Transactions | Mr. Breado Admin' }] }),
  component: OnlineTransactionsPage,
});

function OnlineTransactionsPage() {
  const { data = [], isLoading } = useQuery({ queryKey: ['online-transactions'], queryFn: onlineTransactionsService.list, staleTime: 15_000 });
  const download = useMutation({ mutationFn: onlineTransactionsService.downloadReceipt, onError: () => toast.error('Receipt could not be downloaded') });
  return <>
    <PageHeader title="Online Transactions" icon={<CreditCard className="h-5 w-5" />} breadcrumbs={[{label:'Dashboard',to:'/'},{label:'Online Transactions'}]} />
    <div className="rounded-2xl border border-border bg-card shadow-card overflow-x-auto">
      <table className="w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">Txn</th><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Seller</th><th className="p-3">Restaurant</th><th className="p-3">Razorpay</th><th className="p-3">Amount</th><th className="p-3">Status</th><th className="p-3">Receipt</th></tr></thead>
      <tbody>{isLoading ? <tr><td colSpan={9} className="p-8 text-center">Loading...</td></tr> : data.map((t:any)=><tr key={t.id} className="border-t border-border"><td className="p-3 font-bold">#{t.id}</td><td className="p-3">{t.orderId || t.orderNumber || '-'}</td><td className="p-3">#{t.customerId || '-'}<br/><span className="text-muted-foreground">{t.customerName || ''}</span></td><td className="p-3">#{t.sellerId || '-'}<br/><span className="text-muted-foreground">{t.sellerName || ''}</span></td><td className="p-3">#{t.restaurantId || '-'}<br/><span className="text-muted-foreground">{t.restaurantName || ''}</span></td><td className="p-3"><div>{t.razorpayOrderId || '-'}</div><div className="text-muted-foreground">{t.razorpayPaymentId || '-'}</div></td><td className="p-3 font-bold">{t.currency || 'INR'} {Number(t.amount || 0).toFixed(2)}</td><td className="p-3"><StatusBadge status={t.status || 'UNKNOWN'} /></td><td className="p-3"><button onClick={() => download.mutate(t.id)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 font-bold hover:bg-muted"><Download className="h-4 w-4"/>PDF</button></td></tr>)}{!isLoading && data.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-muted-foreground">No online transactions found.</td></tr>}</tbody></table>
    </div>
  </>;
}
