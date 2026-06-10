import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Bell, Check, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { customerMessagesService, type NotificationReceiver, type NotificationType } from "@/services/customer-messages.service";

export const Route = createFileRoute("/customer-messages")({
  head: () => ({ meta: [{ title: "Admin Notifications | Mr Breado Admin" }] }),
  component: CustomerMessagesPage,
});

const receivers: NotificationReceiver[] = ["CUSTOMERS", "SELLERS", "DRIVERS", "ALL"];
const messageTypes: NotificationType[] = ["OFFER", "DEAL", "ISSUE", "SYSTEM"];

function CustomerMessagesPage() {
  const [form, setForm] = useState({
    receiver: "CUSTOMERS" as NotificationReceiver,
    messageType: "OFFER" as NotificationType,
    title: "",
    message: "",
    targetValue: "",
  });

  const send = useMutation({
    mutationFn: () => customerMessagesService.sendNotification(form),
    onSuccess: () => {
      toast.success("Notification sent successfully");
      setForm({ receiver: "CUSTOMERS", messageType: "OFFER", title: "", message: "", targetValue: "" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const canSend = form.title.trim().length > 0 && form.message.trim().length > 0;

  return (
    <>
      <PageHeader
        title="Admin Notifications"
        icon={<Bell className="h-5 w-5" />}
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Admin Notifications" }]}
      />

      <section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-5 shadow-card md:p-7">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Send app notifications</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Send offers, app updates, seller notices, driver alerts, or important broadcasts using the same backend flow as the mobile admin app.
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-background/40 p-4 md:p-5">
          <SectionTitle title="Receiver" />
          <div className="flex flex-wrap gap-3">
            {receivers.map((receiver) => (
              <Chip
                key={receiver}
                active={form.receiver === receiver}
                label={label(receiver)}
                onClick={() => setForm((f) => ({ ...f, receiver }))}
              />
            ))}
          </div>

          <SectionTitle title="Message Type" className="mt-7" />
          <div className="flex flex-wrap gap-3">
            {messageTypes.map((messageType) => (
              <Chip
                key={messageType}
                active={form.messageType === messageType}
                label={label(messageType)}
                onClick={() => setForm((f) => ({ ...f, messageType }))}
                orange={form.messageType === messageType}
              />
            ))}
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_340px]">
            <div className="space-y-5">
              <Field
                label="Title"
                placeholder="Example: Weekend Pizza Deal"
                value={form.title}
                onChange={(v) => setForm((f) => ({ ...f, title: v }))}
              />
              <TextArea
                label="Message"
                placeholder="Example: Get 20% off on selected items today only."
                value={form.message}
                onChange={(v) => setForm((f) => ({ ...f, message: v }))}
              />
              <Field
                label="Optional target value"
                placeholder="Example: product slug, restaurant slug, offer id, order id"
                value={form.targetValue}
                onChange={(v) => setForm((f) => ({ ...f, targetValue: v }))}
              />
            </div>

            <aside className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Bell className="h-4 w-4 text-primary" /> Preview
              </div>
              <div className="mt-4 rounded-xl border border-border bg-background p-4">
                <div className="mb-3 inline-flex rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-bold text-primary">
                  {label(form.messageType)} · {label(form.receiver)}
                </div>
                <h3 className="text-base font-semibold">{form.title || "Weekend Pizza Deal"}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {form.message || "Get 20% off on selected items today only."}
                </p>
                {form.targetValue && <p className="mt-3 text-xs text-muted-foreground">Target: {form.targetValue}</p>}
              </div>
              <button
                disabled={!canSend || send.isPending}
                onClick={() => send.mutate()}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {send.isPending ? "Sending..." : "Send Notification"}
              </button>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

function label(v: string) {
  return v.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());
}

function SectionTitle({ title, className = "" }: { title: string; className?: string }) {
  return <h3 className={`mb-3 text-sm font-bold tracking-tight ${className}`}>{title}</h3>;
}

function Chip({ active, label, onClick, orange }: { active: boolean; label: string; onClick: () => void; orange?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex min-w-28 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-extrabold uppercase tracking-wide transition-all ${
        active
          ? orange
            ? "border-primary bg-primary text-primary-foreground shadow-glow"
            : "border-primary bg-sidebar text-sidebar-foreground shadow-glow"
          : "border-border bg-card text-foreground hover:border-primary/60 hover:bg-primary/10"
      }`}
    >
      {active && <Check className="h-4 w-4" />}
      {label}
    </button>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 min-h-40 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}
