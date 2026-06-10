import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  Active: "bg-success/15 text-success border-success/30",
  Inactive: "bg-muted text-muted-foreground border-border",
  Pending: "bg-warning/15 text-warning border-warning/30",
  Accepted: "bg-info/15 text-info border-info/30",
  Preparing: "bg-primary/15 text-primary border-primary/30",
  Ready: "bg-success/15 text-success border-success/30",
  "Ready for Pickup": "bg-success/15 text-success border-success/30",
  READY_FOR_PICKUP: "bg-success/15 text-success border-success/30",
  Delivered: "bg-success/15 text-success border-success/30",
  Cancelled: "bg-destructive/15 text-destructive border-destructive/30",
  Suspended: "bg-destructive/15 text-destructive border-destructive/30",
  Open: "bg-info/15 text-info border-info/30",
  "In Progress": "bg-warning/15 text-warning border-warning/30",
  Resolved: "bg-success/15 text-success border-success/30",
  High: "bg-destructive/15 text-destructive border-destructive/30",
  Medium: "bg-warning/15 text-warning border-warning/30",
  Low: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
      variants[status] ?? variants.Inactive
    )}>
      {status}
    </span>
  );
}
