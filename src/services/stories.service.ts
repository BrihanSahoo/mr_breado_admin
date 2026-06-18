import { api } from '@/api/client';

export type BiteStory = {
  id?: number | string;
  title: string;
  subtitle?: string;
  description?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  actionType?: string;
  actionValue?: string;
  sortOrder?: number;
  active?: boolean;
};

function payloadOf(response: any): any {
  return response?.data?.data ?? response?.data ?? response;
}

function normalizeList(data: any): BiteStory[] {
  const raw = Array.isArray(data) ? data : data?.items ?? data?.content ?? data?.stories ?? data?.records ?? [];
  return Array.isArray(raw) ? raw : [];
}

function storyForm(payload: Partial<BiteStory>, image?: File | null): FormData {
  const fd = new FormData();
  fd.append('title', String(payload.title ?? '').trim());
  fd.append('subtitle', String(payload.subtitle ?? ''));
  fd.append('description', String(payload.description ?? ''));
  fd.append('actionType', String(payload.actionType ?? ''));
  fd.append('actionValue', String(payload.actionValue ?? ''));
  fd.append('sortOrder', String(payload.sortOrder ?? 0));
  fd.append('active', String(payload.active !== false));
  if (image) fd.append('image', image);
  else if (payload.mediaUrl) fd.append('mediaUrl', payload.mediaUrl);
  return fd;
}

export const storiesService = {
  async list() { return normalizeList(payloadOf(await api.get('/admin/stories'))); },
  async create(payload: Partial<BiteStory>, image?: File | null) { return payloadOf(await api.post('/admin/stories', storyForm(payload, image))); },
  async update(id: number | string, payload: Partial<BiteStory>, image?: File | null) { return payloadOf(await api.put(`/admin/stories/${id}`, storyForm(payload, image))); },
  async setStatus(id: number | string, active: boolean) { return payloadOf(await api.patch(`/admin/stories/${id}/status`, { active })); },
  async remove(id: number | string) { await api.delete(`/admin/stories/${id}`); },
};
