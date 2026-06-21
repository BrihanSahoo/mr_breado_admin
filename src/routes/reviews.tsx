import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { ServerTable, type ServerColumn } from "@/components/admin/server-table";
import { Star, MessageSquare } from "lucide-react";
import { useReviews } from "@/hooks/queries/use-reviews";
import type { OrderReviewResponse } from "@/types";

export const Route = createFileRoute("/reviews")({
  head: () => ({ meta: [{ title: "Reviews | Mr. Breado Admin" }] }),
  component: ReviewsPage,
});

function Rating({ value }: { value?: number }) {
  const v = Math.round(value ?? 0);
  return (
    <span className="inline-flex items-center gap-0.5 text-warning">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3 w-3 ${i < v ? "fill-current" : "opacity-30"}`} />
      ))}
      <span className="ml-1 text-xs text-foreground">{value ?? 0}</span>
    </span>
  );
}

function ReviewsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error } = useReviews({ page, perPage: 20 });
  const items = data?.items ?? [];

  const cols: ServerColumn<OrderReviewResponse>[] = [
    { key: "order", header: "Order", render: (r) => (
      <div>
        <div className="font-mono text-primary">{r.orderNumber}</div>
        <div className="text-xs text-muted-foreground">#{r.orderId}</div>
      </div>
    )},
    { key: "restaurantRating", header: "Restaurant", render: (r) => <Rating value={r.restaurantRating} /> },
    { key: "restaurantComment", header: "Restaurant comment", render: (r) => (
      <span className="line-clamp-2 max-w-md text-xs text-muted-foreground">{r.restaurantComment || "—"}</span>
    )},
    { key: "driverRating", header: "Driver", render: (r) => <Rating value={r.driverRating} /> },
    { key: "driverComment", header: "Driver comment", render: (r) => (
      <span className="line-clamp-2 max-w-md text-xs text-muted-foreground">{r.driverComment || "—"}</span>
    )},
    { key: "createdAt", header: "Date", render: (r) => r.createdAt ? new Date(r.createdAt).toLocaleString() : "—" },
  ];

  return (
    <>
      <PageHeader title="Reviews" icon={<MessageSquare className="h-5 w-5" />}
        breadcrumbs={[{label:"Dashboard",to:"/"},{label:"Reviews"}]} />
      <ServerTable
        title={`${data?.total ?? 0} reviews`}
        columns={cols}
        items={items}
        page={page}
        totalPages={data?.total_pages ?? 1}
        total={data?.total ?? 0}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onPageChange={setPage}
        rowKey={(r) => r.id}
      />
    </>
  );
}
