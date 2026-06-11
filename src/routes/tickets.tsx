import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import type { Column } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { useSupportTickets } from "@/hooks/queries/use-support";
import { useAcceptSupportTicket, useDeleteSupportTicket, useReplySupportTicket } from "@/hooks/mutations/use-support-mutations";
import { Ticket, Eye, MessageSquare, Trash2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/tickets")({
  head: () => ({ meta: [{ title: "Support Tickets | Mr Breado Admin" }] }),
  component: TicketsPage,
});

function TicketsPage() {
  const { data, isLoading } = useSupportTickets({ page: 1, perPage: 50 });
  const accept = useAcceptSupportTicket();
  const del = useDeleteSupportTicket();
  const [selected, setSelected] = useState<any | null>(null);
  const items = data?.items ?? [];

  const cols: Column<any>[] = [
    { key: "userName", header: "User Name", render: (r) => r.userName ?? r.user?.name ?? "Unknown User" },
    { key: "employeeName", header: "Employee Name", render: (r) => r.employeeName ?? r.assignedEmployee?.name ?? "-" },
    { key: "type", header: "Type", render: (r) => r.userType ?? r.type ?? r.user?.type ?? "Customer" },
    { key: "issue", header: "Issue", render: (r) => r.issue ?? r.subject ?? "Support Issue" },
    { key: "createdAt", header: "CreatedAt", render: (r) => r.createdAt ? new Date(r.createdAt).toLocaleString() : "-" },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions", header: "Actions", render: (r) => (
      <div className="flex items-center gap-2">
        <button onClick={() => setSelected(r)} className="rounded p-1.5 text-info hover:bg-info/10"><Eye className="h-4 w-4" /></button>
        <button onClick={() => setSelected({ ...r, replyMode: true })} className="rounded p-1.5 text-primary hover:bg-primary/10"><MessageSquare className="h-4 w-4" /></button>
        <button onClick={() => del.mutate(r.id)} className="rounded p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
        {String(r.status).toUpperCase() === "PENDING" && <button onClick={() => accept.mutate(r.id)} className="rounded-md gradient-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Accept</button>}
      </div>
    ) },
  ];

  return (
    <>
      <PageHeader title="Support Ticket" icon={<Ticket className="h-5 w-5" />} breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Support Ticket" }]} />
      <DataTable data={items} columns={cols} searchableKeys={["userName", "employeeName", "issue", "status"]} loading={isLoading as any} title="Tickets" />
      {selected && <TicketDetailsModal ticket={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function TicketDetailsModal({ ticket, onClose }: { ticket: any; onClose: () => void }) {
  const user = ticket.user ?? {};
  const employee = ticket.assignedEmployee ?? {};
  const reply = useReplySupportTicket();
  const [message, setMessage] = useState("");
  const sendReply = () => {
    const text = message.trim();
    if (!text) return;
    reply.mutate({ id: ticket.id, message: text }, { onSuccess: () => { setMessage(""); onClose(); } });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold">Support Ticket Details</h3><button onClick={onClose}>✕</button></div>
        <Detail title="User Details" rows={{ Name: ticket.userName ?? user.name, Email: user.email, PhoneNumber: user.phone }} />
        <Detail title="Employee Details" rows={{ Name: ticket.employeeName ?? employee.name ?? "-", Email: employee.email ?? "-", PhoneNumber: employee.phone ?? "-" }} />
        <div className="rounded-lg border border-border bg-background p-4">
          <div className="flex items-center justify-between gap-3"><h4 className="font-semibold">{ticket.issue ?? ticket.subject}</h4><StatusBadge status={ticket.status} /></div>
          <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{ticket.description ?? "No description provided."}</p>
        </div>
        <div className="mt-4 rounded-lg border border-border bg-background p-4">
          <h4 className="mb-2 font-semibold">Reply to user</h4>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-28 w-full rounded-lg border border-border bg-card p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Write a clear reply. The user will receive this as an app notification."
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">Close</button>
          <button onClick={sendReply} disabled={reply.isPending || !message.trim()} className="rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">{reply.isPending ? "Sending…" : "Send reply"}</button>
        </div>
      </div>
    </div>
  );
}

function Detail({ title, rows }: { title: string; rows: Record<string, any> }) {
  return <div className="mb-3 rounded-lg border border-border bg-background p-4"><h4 className="mb-2 font-semibold">{title}</h4>{Object.entries(rows).map(([k,v]) => <div key={k} className="flex justify-between gap-4 text-sm"><span className="text-muted-foreground">{k} :</span><span>{v || "-"}</span></div>)}</div>;
}
