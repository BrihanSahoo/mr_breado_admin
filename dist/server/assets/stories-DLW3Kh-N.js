import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Sparkles, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { r as request, P as PageHeader } from "./router-1xz68c6T.js";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
function normalizeList(data) {
  const raw = Array.isArray(data) ? data : data?.items ?? data?.content ?? data?.stories ?? data?.records ?? [];
  return Array.isArray(raw) ? raw : [];
}
const storiesService = {
  async list() {
    return normalizeList(await request({ url: "/admin/stories", method: "GET" }));
  },
  async create(payload) {
    return request({ url: "/admin/stories", method: "POST", data: payload });
  },
  async update(id, payload) {
    return request({ url: `/admin/stories/${id}`, method: "PUT", data: payload });
  },
  async setStatus(id, active) {
    return request({ url: `/admin/stories/${id}/status`, method: "PATCH", data: { active, enabled: active, status: active ? "ACTIVE" : "INACTIVE" } });
  },
  async remove(id) {
    return request({ url: `/admin/stories/${id}`, method: "DELETE" });
  }
};
function StoriesPage() {
  const qc = useQueryClient();
  const {
    data = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-stories"],
    queryFn: storiesService.list
  });
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const save = useMutation({
    mutationFn: (payload) => editing?.id ? storiesService.update(editing.id, payload) : storiesService.create(payload),
    onSuccess: () => {
      toast.success("Story saved");
      qc.invalidateQueries({
        queryKey: ["admin-stories"]
      });
      setOpen(false);
      setEditing(null);
    },
    onError: () => toast.error("Story could not be saved")
  });
  const del = useMutation({
    mutationFn: storiesService.remove,
    onSuccess: () => {
      toast.success("Story deleted");
      qc.invalidateQueries({
        queryKey: ["admin-stories"]
      });
    },
    onError: () => toast.error("Story could not be deleted")
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Bite Stories", icon: /* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Bite Stories"
    }], actions: /* @__PURE__ */ jsxs("button", { onClick: () => {
      setEditing(null);
      setOpen(true);
    }, className: "inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2 text-sm font-bold text-primary-foreground", children: [
      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
      "Add Story"
    ] }) }),
    isLoading ? /* @__PURE__ */ jsx("div", { className: "grid gap-3", children: Array.from({
      length: 5
    }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-28 animate-pulse rounded-xl bg-muted" }, i)) }) : /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3", children: [
      data.map((s) => /* @__PURE__ */ jsxs("article", { className: "overflow-hidden rounded-2xl border border-border bg-card shadow-card", children: [
        /* @__PURE__ */ jsx("div", { className: "h-40 bg-muted", children: s.mediaUrl || s.thumbnailUrl ? /* @__PURE__ */ jsx("img", { src: s.mediaUrl || s.thumbnailUrl, className: "h-full w-full object-cover" }) : null }),
        /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-extrabold", children: s.title }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: s.subtitle || "Visible in user Bite Stories" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary", children: s.active === false ? "Inactive" : "Active" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex gap-2", children: [
            /* @__PURE__ */ jsxs("button", { onClick: () => {
              setEditing(s);
              setOpen(true);
            }, className: "rounded-lg border px-3 py-2 text-sm font-bold", children: [
              /* @__PURE__ */ jsx(Pencil, { className: "inline h-4 w-4" }),
              " Edit"
            ] }),
            /* @__PURE__ */ jsxs("button", { onClick: () => del.mutate(s.id), className: "rounded-lg border border-destructive/30 px-3 py-2 text-sm font-bold text-destructive", children: [
              /* @__PURE__ */ jsx(Trash2, { className: "inline h-4 w-4" }),
              " Delete"
            ] })
          ] })
        ] })
      ] }, s.id)),
      data.length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-full rounded-xl border border-dashed p-10 text-center text-muted-foreground", children: "No stories yet. Add one from admin and users will see it exactly in Bite Stories." })
    ] }),
    open && /* @__PURE__ */ jsx(StoryModal, { story: editing, busy: save.isPending, onClose: () => setOpen(false), onSave: (payload) => save.mutate(payload) })
  ] });
}
function StoryModal({
  story,
  busy,
  onClose,
  onSave
}) {
  const [title, setTitle] = useState(story?.title ?? "");
  const [subtitle, setSubtitle] = useState(story?.subtitle ?? "");
  const [description, setDescription] = useState(story?.description ?? "");
  const [mediaUrl, setMediaUrl] = useState(story?.mediaUrl ?? story?.thumbnailUrl ?? "");
  const [active, setActive] = useState(story?.active !== false);
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-xl rounded-2xl bg-card p-6 shadow-2xl", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-extrabold", children: story ? "Edit Story" : "Add Story" }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-3", children: [
      /* @__PURE__ */ jsx("input", { className: "rounded-xl border bg-background px-3 py-3", placeholder: "Title", value: title, onChange: (e) => setTitle(e.target.value) }),
      /* @__PURE__ */ jsx("input", { className: "rounded-xl border bg-background px-3 py-3", placeholder: "Subtitle", value: subtitle, onChange: (e) => setSubtitle(e.target.value) }),
      /* @__PURE__ */ jsx("textarea", { className: "rounded-xl border bg-background px-3 py-3", placeholder: "Description", value: description, onChange: (e) => setDescription(e.target.value) }),
      /* @__PURE__ */ jsx("input", { className: "rounded-xl border bg-background px-3 py-3", placeholder: "Image/video URL", value: mediaUrl, onChange: (e) => setMediaUrl(e.target.value) }),
      /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm font-bold", children: [
        /* @__PURE__ */ jsx("input", { type: "checkbox", checked: active, onChange: (e) => setActive(e.target.checked) }),
        " Active"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "rounded-xl border px-4 py-2 font-bold", children: "Cancel" }),
      /* @__PURE__ */ jsx("button", { disabled: busy || !title.trim(), onClick: () => onSave({
        title,
        subtitle,
        description,
        mediaUrl,
        thumbnailUrl: mediaUrl,
        active
      }), className: "rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground disabled:opacity-50", children: "Save" })
    ] })
  ] }) });
}
export {
  StoriesPage as component
};
