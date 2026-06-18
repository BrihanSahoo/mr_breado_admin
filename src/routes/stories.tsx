import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ImagePlus, Pencil, Plus, Sparkles, Trash2, UploadCloud, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/admin/page-header';
import { storiesService, type BiteStory } from '@/services/stories.service';

export const Route = createFileRoute('/stories')({
  head: () => ({ meta: [{ title: 'Bite Stories | Mr. Breado Admin' }] }),
  component: StoriesPage,
});

function getErrorMessage(error: any) {
  return error?.response?.data?.message || error?.message || 'Story could not be saved';
}

function StoriesPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ['admin-stories'], queryFn: storiesService.list });
  const [editing, setEditing] = useState<BiteStory | null>(null);
  const [open, setOpen] = useState(false);
  const save = useMutation({
    mutationFn: ({ payload, image }: { payload: Partial<BiteStory>; image?: File | null }) => editing?.id ? storiesService.update(editing.id, payload, image) : storiesService.create(payload, image),
    onSuccess: () => { toast.success('Story saved and uploaded to Cloudinary'); qc.invalidateQueries({ queryKey: ['admin-stories'] }); setOpen(false); setEditing(null); },
    onError: (error: any) => toast.error(getErrorMessage(error)),
  });
  const del = useMutation({ mutationFn: storiesService.remove, onSuccess: () => { toast.success('Story deleted'); qc.invalidateQueries({ queryKey: ['admin-stories'] }); }, onError: (error: any) => toast.error(getErrorMessage(error)) });

  return <>
    <PageHeader title="Bite Stories" icon={<Sparkles className="h-5 w-5" />} breadcrumbs={[{label:'Dashboard',to:'/'},{label:'Bite Stories'}]} actions={<button onClick={() => { setEditing(null); setOpen(true); }} className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2 text-sm font-bold text-primary-foreground"><Plus className="h-4 w-4"/>Add Story</button>} />
    {isLoading ? <div className="grid gap-3">{Array.from({length:5}).map((_,i)=><div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />)}</div> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {data.map((s:any) => <article key={s.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="h-48 bg-muted">{(s.mediaUrl || s.thumbnailUrl || s.imageUrl) ? <img src={s.mediaUrl || s.thumbnailUrl || s.imageUrl} alt={s.title} className="h-full w-full object-cover" onError={(e)=>{e.currentTarget.style.display='none';}} /> : <div className="grid h-full place-items-center text-muted-foreground"><ImagePlus className="h-8 w-8"/></div>}</div>
        <div className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-extrabold">{s.title}</h3><p className="text-sm text-muted-foreground">{s.subtitle || 'Visible in user Bite Stories'}</p></div><span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">{s.active === false ? 'Inactive' : 'Active'}</span></div>
          <div className="mt-4 flex gap-2"><button onClick={() => { setEditing(s); setOpen(true); }} className="rounded-lg border px-3 py-2 text-sm font-bold"><Pencil className="inline h-4 w-4"/> Edit</button><button onClick={() => del.mutate(s.id!)} className="rounded-lg border border-destructive/30 px-3 py-2 text-sm font-bold text-destructive"><Trash2 className="inline h-4 w-4"/> Delete</button></div>
        </div>
      </article>)}
      {data.length === 0 && <div className="col-span-full rounded-xl border border-dashed p-10 text-center text-muted-foreground">No stories yet. Add an image from your computer and it will be uploaded to Cloudinary and shown in the user app.</div>}
    </div>}
    {open && <StoryModal story={editing} busy={save.isPending} onClose={() => setOpen(false)} onSave={(payload,image) => save.mutate({payload,image})} />}
  </>;
}

function StoryModal({ story, busy, onClose, onSave }: { story: BiteStory | null; busy: boolean; onClose: () => void; onSave: (payload: Partial<BiteStory>, image?: File | null) => void }) {
  const [title, setTitle] = useState(story?.title ?? '');
  const [subtitle, setSubtitle] = useState(story?.subtitle ?? '');
  const [description, setDescription] = useState(story?.description ?? '');
  const [file, setFile] = useState<File | null>(null);
  const [active, setActive] = useState(story?.active !== false);
  const preview = useMemo(() => file ? URL.createObjectURL(file) : (story?.mediaUrl || story?.thumbnailUrl || ''), [file, story]);
  useEffect(() => () => { if (file && preview.startsWith('blob:')) URL.revokeObjectURL(preview); }, [file, preview]);
  const choose = (candidate?: File) => {
    if (!candidate) return;
    if (!['image/jpeg','image/png','image/webp','image/gif'].includes(candidate.type)) return toast.error('Use JPG, PNG, WEBP or GIF');
    if (candidate.size > 5 * 1024 * 1024) return toast.error('Story image must be 5 MB or smaller');
    setFile(candidate);
  };
  const canSave = Boolean(title.trim() && (file || story?.mediaUrl || story?.thumbnailUrl));
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl">
    <div className="flex items-center justify-between"><h2 className="text-xl font-extrabold">{story ? 'Edit Story' : 'Add Story'}</h2><button onClick={onClose} className="rounded-lg p-2 hover:bg-muted"><X className="h-5 w-5"/></button></div>
    <div className="mt-4 grid gap-3"><input className="rounded-xl border bg-background px-3 py-3" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} /><input className="rounded-xl border bg-background px-3 py-3" placeholder="Subtitle" value={subtitle} onChange={e=>setSubtitle(e.target.value)} /><textarea className="rounded-xl border bg-background px-3 py-3" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <label className="cursor-pointer rounded-2xl border-2 border-dashed p-4 text-center hover:bg-muted/40"><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={e=>choose(e.target.files?.[0])}/>{preview ? <img src={preview} alt="Story preview" className="mx-auto h-52 w-full rounded-xl object-cover"/> : <div className="grid h-44 place-items-center"><div><UploadCloud className="mx-auto h-9 w-9 text-primary"/><div className="mt-2 font-bold">Choose story image from computer</div><div className="mt-1 text-xs text-muted-foreground">JPG, PNG, WEBP or GIF · maximum 5 MB</div></div></div>}</label>
      {file && <div className="text-xs text-muted-foreground">Selected: {file.name}</div>}
      <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)} /> Active</label></div>
    <div className="mt-5 flex justify-end gap-2"><button onClick={onClose} className="rounded-xl border px-4 py-2 font-bold">Cancel</button><button disabled={busy || !canSave} onClick={() => onSave({ title, subtitle, description, active }, file)} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground disabled:opacity-50">{busy ? 'Uploading…' : 'Save Story'}</button></div>
  </div></div>;
}
