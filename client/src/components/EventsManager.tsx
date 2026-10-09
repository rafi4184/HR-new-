import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Pencil, Plus, Image as ImageIcon, Video, Loader2 } from "lucide-react";
import { inputClass } from "./ui/Field";
import {
  listEvents,
  adminUpsertEvent,
  adminDeleteEvent,
  adminUploadEventMedia,
  adminDeleteEventMedia,
  ApiError,
} from "../lib/api";
import type { EventItem } from "../types";

function panelError(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback;
}

export default function EventsManager({ onToast }: { onToast: (msg: string) => void }) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EventItem | "new" | null>(null);
  const [uploadingFor, setUploadingFor] = useState<number | null>(null);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      setEvents(await listEvents());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const openEditor = (target: EventItem | "new") => {
    setNewFiles([]);
    setEditing(target);
  };

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    setSaving(true);
    try {
      const saved = await adminUpsertEvent({
        id: editing !== "new" && editing ? editing.id : undefined,
        title: data.title,
        description: data.description,
        eventDate: data.eventDate || undefined,
        location: data.location,
      });
      const startIndex = editing !== "new" && editing ? editing.media.length : 0;
      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        const mediaType = file.type.startsWith("video/") ? "video" : "image";
        await adminUploadEventMedia(saved.id, file, mediaType, startIndex + i);
      }
      onToast("Event saved.");
      setEditing(null);
      setNewFiles([]);
      void refresh();
    } catch (err) {
      onToast(panelError(err, "Couldn't save that event."));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (ev: EventItem) => {
    if (!window.confirm(`Delete "${ev.title}" and all its photos/video?`)) return;
    try {
      await adminDeleteEvent(ev.id);
      onToast("Event deleted.");
      void refresh();
    } catch (err) {
      onToast(panelError(err, "Couldn't delete that event."));
    }
  };

  const upload = async (ev: EventItem, file: File) => {
    const mediaType = file.type.startsWith("video/") ? "video" : "image";
    setUploadingFor(ev.id);
    try {
      await adminUploadEventMedia(ev.id, file, mediaType, ev.media.length);
      onToast(`${mediaType === "video" ? "Video" : "Photo"} added to ${ev.title}.`);
      void refresh();
    } catch (err) {
      onToast(panelError(err, "Upload failed."));
    } finally {
      setUploadingFor(null);
    }
  };

  const removeMedia = async (mediaId: number) => {
    try {
      await adminDeleteEventMedia(mediaId);
      void refresh();
    } catch (err) {
      onToast(panelError(err, "Couldn't remove that file."));
    }
  };

  return (
    <div>
      <button
        onClick={() => openEditor("new")}
        className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-md bg-navy text-white mb-4 active:scale-[0.97] transition-transform"
      >
        <Plus size={15} /> Add event
      </button>

      {loading ? (
        <div className="shimmer rounded-lg h-16 animate-shimmer" />
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center border-border-strong text-ink-faint text-[13px]">
          No events yet.
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((ev) => (
            <div key={ev.id} className="rounded-lg border border-border p-3.5 bg-white">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <div className="text-[14px] font-medium">{ev.title}</div>
                  <div className="text-[12px] text-ink-faint">
                    {ev.eventDate ?? "No date"} {ev.location ? `· ${ev.location}` : ""}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEditor(ev)} className="p-2 rounded-md border border-border-strong text-ink-soft">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => remove(ev)} className="p-2 rounded-md border border-border-strong text-[#8A3B22]">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                {ev.media.map((m) => (
                  <div key={m.id} className="relative w-16 h-16 rounded-md overflow-hidden border border-border group">
                    {m.mediaType === "image" ? (
                      <img src={m.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-navy/10">
                        <Video size={18} />
                      </div>
                    )}
                    <button
                      onClick={() => removeMedia(m.id)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} color="#fff" />
                    </button>
                  </div>
                ))}
              </div>

              <label className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1.5 rounded-md border border-border-strong text-ink-soft cursor-pointer">
                {uploadingFor === ev.id ? <Loader2 size={13} className="animate-spin" /> : <ImageIcon size={13} />}
                Add photo/video
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  disabled={uploadingFor === ev.id}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void upload(ev, file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60"
            onClick={() => !saving && setEditing(null)}
          >
            <motion.form
              onSubmit={save}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm rounded-xl p-6 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-display text-lg mb-4">{editing === "new" ? "Add event" : "Edit event"}</div>
              <input name="title" placeholder="Title" defaultValue={editing !== "new" ? editing.title : ""} required className={`${inputClass} mb-3`} />
              <textarea name="description" placeholder="Description" defaultValue={editing !== "new" ? (editing.description ?? "") : ""} rows={3} className={`${inputClass} mb-3`} />
              <input name="eventDate" type="date" defaultValue={editing !== "new" ? (editing.eventDate ?? "") : ""} className={`${inputClass} mb-3`} />
              <input name="location" placeholder="Location" defaultValue={editing !== "new" ? (editing.location ?? "") : ""} className={`${inputClass} mb-3`} />

              <label className="block text-[12px] font-medium text-ink-faint mb-1.5">
                {editing === "new" ? "Photos / video" : "Add more photos / video"}
              </label>
              <label className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-2.5 rounded-md border border-dashed border-border-strong text-ink-soft cursor-pointer mb-4 justify-center hover:border-ink-faint transition-colors">
                <ImageIcon size={14} />
                {newFiles.length > 0 ? `${newFiles.length} file${newFiles.length > 1 ? "s" : ""} selected` : "Choose photos or a video"}
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  disabled={saving}
                  onChange={(e) => setNewFiles(Array.from(e.target.files ?? []))}
                />
              </label>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 rounded-md font-medium text-[14px] bg-navy text-white flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? "Saving…" : "Save"}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
