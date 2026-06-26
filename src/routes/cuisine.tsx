import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Loader2, Pencil, Plus, Soup, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { DataTable, type Column } from "@/components/admin/data-table";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  useCreateCuisine,
  useDeleteCuisine,
  useToggleCuisineStatus,
  useUpdateCuisine,
} from "@/hooks/mutations/use-cuisine-mutations";
import { useCuisines } from "@/hooks/queries/use-cuisines";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cuisine")({
  head: () => ({ meta: [{ title: "Cuisine | Mr. Breado Admin" }] }),
  component: CuisinePage,
});

type CuisineRow = {
  id: string;
  name: string;
  status?: string;
  img?: string;
  imageUrl?: string;
  description?: string;
  sortOrder?: number;
};

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/heic",
  "image/heif",
]);
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

function CuisinePage() {
  const { data, isLoading, isError, refetch } = useCuisines();
  const items = (data ?? []) as CuisineRow[];
  const createCuisine = useCreateCuisine();
  const updateCuisine = useUpdateCuisine();
  const deleteCuisine = useDeleteCuisine();
  const toggleCuisine = useToggleCuisineStatus();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CuisineRow | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [sortOrder, setSortOrder] = useState("0");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const saving = createCuisine.isPending || updateCuisine.isPending;

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const resetForm = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setStatus("Active");
    setSortOrder("0");
    setFile(null);
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openCreate = () => {
    haptic(18);
    resetForm();
    setOpen(true);
  };

  const openEdit = (row: CuisineRow) => {
    haptic(18);
    setEditing(row);
    setName(row.name ?? "");
    setDescription(row.description ?? "");
    setStatus(row.status ?? "Active");
    setSortOrder(String(row.sortOrder ?? 0));
    setFile(null);
    setPreview(row.img || row.imageUrl || "");
    setOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    haptic(12);
    setOpen(false);
    resetForm();
  };

  const selectFile = (selected: File | null) => {
    if (!selected) return;
    const extension = selected.name.split(".").pop()?.toLowerCase() ?? "";
    const supportedByExtension = ["jpg", "jpeg", "png", "webp", "gif", "avif", "heic", "heif"].includes(extension);
    if (!IMAGE_TYPES.has(selected.type.toLowerCase()) && !supportedByExtension) {
      toast.error("Choose a JPG, PNG, WebP, GIF, AVIF, HEIC, or HEIF image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (selected.size > MAX_IMAGE_SIZE) {
      toast.error("Choose an image smaller than 8 MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    haptic(16);
    setFile(selected);
  };

  const save = async () => {
    const normalizedName = name.trim();
    if (!normalizedName) {
      haptic([30, 30, 30]);
      toast.error("Enter a cuisine name.");
      return;
    }
    if (normalizedName.length > 80) {
      toast.error("Cuisine name must be 80 characters or fewer.");
      return;
    }

    const payload = new FormData();
    payload.append("name", normalizedName);
    payload.append("description", description.trim());
    payload.append("status", status);
    payload.append("active", String(status === "Active"));
    payload.append("sortOrder", String(Number(sortOrder) || 0));
    if (file) payload.append("image", file, file.name);

    try {
      if (editing) {
        await updateCuisine.mutateAsync({ id: editing.id, payload });
      } else {
        await createCuisine.mutateAsync(payload);
      }
      setOpen(false);
      resetForm();
    } catch {
      // Mutation hooks display a safe, contextual message. Keep the form open.
    }
  };

  const columns = useMemo<Column<CuisineRow>[]>(() => [
    {
      key: "img",
      header: "Image",
      render: (row) => row.img || row.imageUrl ? (
        <img
          src={row.img || row.imageUrl}
          alt={row.name}
          loading="lazy"
          className="h-12 w-12 rounded-2xl border border-border object-cover shadow-sm"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
          <Soup className="h-5 w-5" />
        </div>
      ),
    },
    {
      key: "name",
      header: "Cuisine",
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{row.name}</p>
          <p className="mt-0.5 max-w-[320px] truncate text-xs text-muted-foreground">
            {row.description || "No description added"}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-3 text-xs font-semibold">
            <input
              type="checkbox"
              checked={row.status === "Active"}
              disabled={toggleCuisine.isPending}
              onChange={(event) => toggleCuisine.mutate({
                id: row.id,
                status: event.target.checked ? "Active" : "Inactive",
              })}
              className="peer sr-only"
            />
            <span className="relative h-5 w-9 rounded-full bg-muted transition peer-checked:bg-primary after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4" />
            {row.status === "Active" ? "Active" : "Inactive"}
          </label>
          <button
            type="button"
            onClick={() => openEdit(row)}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3 text-xs font-semibold text-primary transition hover:bg-primary/15"
          >
            <Pencil className="h-4 w-4" /> Edit
          </button>
          <button
            type="button"
            disabled={deleteCuisine.isPending}
            onClick={() => {
              haptic([25, 25, 25]);
              if (window.confirm(`Delete ${row.name}? This cannot be undone.`)) {
                deleteCuisine.mutate(row.id);
              }
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-3 text-xs font-semibold text-destructive transition hover:bg-destructive/15 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      ),
    },
  ], [deleteCuisine, toggleCuisine]);

  return (
    <>
      <PageHeader
        title="Cuisine Management"
        icon={<Soup className="h-5 w-5" />}
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Cuisine" }]}
        actions={(
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5 hover:brightness-105 sm:w-auto"
          >
            <Plus className="h-4 w-4" /> Add Cuisine
          </button>
        )}
      />

      {isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 shadow-card">
          <p className="font-semibold">Cuisine data could not be loaded.</p>
          <p className="mt-1 text-sm text-muted-foreground">Check the backend connection and try again.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Retry
          </button>
        </div>
      ) : (
        <DataTable
          data={items}
          columns={columns}
          searchableKeys={["name", "description", "status"]}
          title="All Cuisines"
          subtitle="Create reusable cuisine groups and assign them to foods from the catalogue."
          loading={isLoading}
        />
      )}

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cuisine-dialog-title"
            className="w-full overflow-hidden rounded-t-[28px] border border-border bg-card shadow-2xl sm:max-w-xl sm:rounded-[28px]"
          >
            <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-primary/12 via-primary/5 to-transparent px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Menu catalogue</p>
                <h2 id="cuisine-dialog-title" className="mt-1 text-xl font-bold">
                  {editing ? "Edit cuisine" : "Add cuisine"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 transition hover:bg-accent disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(100dvh-9rem)] overflow-y-auto px-5 py-5 sm:px-6">
              <div className="grid gap-5 sm:grid-cols-[170px_minmax(0,1fr)]">
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[24px] border border-dashed transition",
                      preview ? "border-primary/25 bg-background" : "border-primary/35 bg-primary/5 hover:bg-primary/10",
                    )}
                  >
                    {preview ? (
                      <>
                        <img src={preview} alt="Cuisine preview" className="h-full w-full object-cover" />
                        <span className="absolute inset-x-3 bottom-3 rounded-xl bg-black/70 px-3 py-2 text-center text-xs font-semibold text-white backdrop-blur">
                          Change image
                        </span>
                      </>
                    ) : (
                      <span className="flex flex-col items-center gap-2 px-4 text-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <ImagePlus className="h-6 w-6" />
                        </span>
                        <span className="text-sm font-semibold">Upload cuisine image</span>
                        <span className="text-xs text-muted-foreground">Up to 8 MB</span>
                      </span>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                    onChange={(event) => selectFile(event.target.files?.[0] ?? null)}
                    className="sr-only"
                  />
                  <p className="mt-2 text-center text-[11px] leading-4 text-muted-foreground">
                    JPG, PNG, WebP, GIF, AVIF, HEIC or HEIF
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-semibold">Cuisine name <span className="text-destructive">*</span></span>
                    <input
                      autoFocus
                      value={name}
                      maxLength={80}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="For example: Bengali"
                      className="mt-2 w-full rounded-xl border border-input bg-background px-3.5 py-3 text-base outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                    <span className="mt-1 block text-right text-[11px] text-muted-foreground">{name.length}/80</span>
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold">Description</span>
                    <textarea
                      value={description}
                      maxLength={500}
                      rows={3}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Short customer-facing description"
                      className="mt-2 w-full resize-none rounded-xl border border-input bg-background px-3.5 py-3 text-base outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-sm font-semibold">Status</span>
                      <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-input bg-background px-3.5 py-3 text-base outline-none focus:border-primary"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold">Display order</span>
                      <input
                        type="number"
                        min="0"
                        value={sortOrder}
                        onChange={(event) => setSortOrder(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-input bg-background px-3.5 py-3 text-base outline-none focus:border-primary"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-border bg-background/40 px-5 py-4 sm:flex sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold transition hover:bg-accent disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {saving ? "Saving…" : editing ? "Save changes" : "Create cuisine"}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
