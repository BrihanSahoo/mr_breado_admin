import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { P as PageHeader, S as StatusBadge } from "./router-1xz68c6T.js";
import { D as DataTable } from "./data-table-CTmaB7WY.js";
import { s as supportKeys, a as supportService, u as useSupportTickets } from "./use-support-CoQZ32-t.js";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Ticket, Eye, MessageSquare, Trash2 } from "lucide-react";
import { useState } from "react";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
function useAcceptSupportTicket() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id) => supportService.accept(id), onSuccess: () => {
    toast.success("Ticket accepted");
    qc.invalidateQueries({ queryKey: supportKeys.all });
  }, onError: (e) => toast.error(e.message) });
}
function useReplySupportTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, message }) => supportService.reply(id, message),
    onSuccess: () => {
      toast.success("Reply sent to user");
      qc.invalidateQueries({ queryKey: supportKeys.all });
    },
    onError: (e) => toast.error(e.message)
  });
}
function useDeleteSupportTicket() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id) => supportService.remove(id), onSuccess: () => {
    toast.success("Ticket deleted");
    qc.invalidateQueries({ queryKey: supportKeys.all });
  }, onError: (e) => toast.error(e.message) });
}
function TicketsPage() {
  const {
    data,
    isLoading
  } = useSupportTickets({
    page: 1,
    perPage: 50
  });
  const accept = useAcceptSupportTicket();
  const del = useDeleteSupportTicket();
  const [selected, setSelected] = useState(null);
  const items = data?.items ?? [];
  const cols = [{
    key: "userName",
    header: "User Name",
    render: (r) => r.userName ?? r.user?.name ?? "Unknown User"
  }, {
    key: "employeeName",
    header: "Employee Name",
    render: (r) => r.employeeName ?? r.assignedEmployee?.name ?? "-"
  }, {
    key: "type",
    header: "Type",
    render: (r) => r.userType ?? r.type ?? r.user?.type ?? "Customer"
  }, {
    key: "issue",
    header: "Issue",
    render: (r) => r.issue ?? r.subject ?? "Support Issue"
  }, {
    key: "createdAt",
    header: "CreatedAt",
    render: (r) => r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"
  }, {
    key: "status",
    header: "Status",
    render: (r) => /* @__PURE__ */ jsx(StatusBadge, { status: r.status })
  }, {
    key: "actions",
    header: "Actions",
    render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("button", { onClick: () => setSelected(r), className: "rounded p-1.5 text-info hover:bg-info/10", children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsx("button", { onClick: () => setSelected({
        ...r,
        replyMode: true
      }), className: "rounded p-1.5 text-primary hover:bg-primary/10", children: /* @__PURE__ */ jsx(MessageSquare, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsx("button", { onClick: () => del.mutate(r.id), className: "rounded p-1.5 text-destructive hover:bg-destructive/10", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) }),
      String(r.status).toUpperCase() === "PENDING" && /* @__PURE__ */ jsx("button", { onClick: () => accept.mutate(r.id), className: "rounded-md gradient-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground", children: "Accept" })
    ] })
  }];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Support Ticket", icon: /* @__PURE__ */ jsx(Ticket, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Support Ticket"
    }] }),
    /* @__PURE__ */ jsx(DataTable, { data: items, columns: cols, searchableKeys: ["userName", "employeeName", "issue", "status"], loading: isLoading, title: "Tickets" }),
    selected && /* @__PURE__ */ jsx(TicketDetailsModal, { ticket: selected, onClose: () => setSelected(null) })
  ] });
}
function TicketDetailsModal({
  ticket,
  onClose
}) {
  const user = ticket.user ?? {};
  const employee = ticket.assignedEmployee ?? {};
  const reply = useReplySupportTicket();
  const [message, setMessage] = useState("");
  const sendReply = () => {
    const text = message.trim();
    if (!text) return;
    reply.mutate({
      id: ticket.id,
      message: text
    }, {
      onSuccess: () => {
        setMessage("");
        onClose();
      }
    });
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-2xl rounded-xl border border-border bg-card p-5 shadow-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Support Ticket Details" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, children: "✕" })
    ] }),
    /* @__PURE__ */ jsx(Detail, { title: "User Details", rows: {
      Name: ticket.userName ?? user.name,
      Email: user.email,
      PhoneNumber: user.phone
    } }),
    /* @__PURE__ */ jsx(Detail, { title: "Employee Details", rows: {
      Name: ticket.employeeName ?? employee.name ?? "-",
      Email: employee.email ?? "-",
      PhoneNumber: employee.phone ?? "-"
    } }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-background p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-semibold", children: ticket.issue ?? ticket.subject }),
        /* @__PURE__ */ jsx(StatusBadge, { status: ticket.status })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 whitespace-pre-wrap text-sm text-muted-foreground", children: ticket.description ?? "No description provided." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-lg border border-border bg-background p-4", children: [
      /* @__PURE__ */ jsx("h4", { className: "mb-2 font-semibold", children: "Reply to user" }),
      /* @__PURE__ */ jsx("textarea", { value: message, onChange: (e) => setMessage(e.target.value), className: "min-h-28 w-full rounded-lg border border-border bg-card p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20", placeholder: "Write a clear reply. The user will receive this as an app notification." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "rounded-md border border-border px-4 py-2 text-sm hover:bg-accent", children: "Close" }),
      /* @__PURE__ */ jsx("button", { onClick: sendReply, disabled: reply.isPending || !message.trim(), className: "rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50", children: reply.isPending ? "Sending…" : "Send reply" })
    ] })
  ] }) });
}
function Detail({
  title,
  rows
}) {
  return /* @__PURE__ */ jsxs("div", { className: "mb-3 rounded-lg border border-border bg-background p-4", children: [
    /* @__PURE__ */ jsx("h4", { className: "mb-2 font-semibold", children: title }),
    Object.entries(rows).map(([k, v]) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-4 text-sm", children: [
      /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
        k,
        " :"
      ] }),
      /* @__PURE__ */ jsx("span", { children: v || "-" })
    ] }, k))
  ] });
}
export {
  TicketsPage as component
};
