import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Pencil, Plus, Image as ImageIcon, Video, Loader2, ShieldCheck, Shield, Users, KeyRound } from "lucide-react";
import { inputClass } from "../ui/Field";
import {
  listContacts,
  adminUpsertContact,
  adminDeleteContact,
  listEvents,
  adminUpsertEvent,
  adminDeleteEvent,
  adminUploadEventMedia,
  adminDeleteEventMedia,
  adminListStaff,
  adminCreateStaff,
  adminResetStaffPassword,
  adminSetStaffRole,
  adminRemoveStaff,
  executiveListStaff,
  executiveRemoveStaff,
  ApiError,
} from "../../lib/api";
import type { Contact, EventItem, StaffMember, StaffRole, TeamMember, WhoAmI } from "../../types";

type Tab = "contacts" | "events" | "staff";

const TABS: { key: Tab; label: string }[] = [
  { key: "contacts", label: "Contacts" },
  { key: "events", label: "Events" },
  { key: "staff", label: "Staff" },
];

const ROLE_LABEL: Record<StaffRole, string> = { admin: "Admin", executive: "Executive", staff: "Staff" };

export default function AdminPanel({
  me,
  onToast,
}: {
  me: WhoAmI;
  onToast: (msg: string) => void;
}) {
  const [tab, setTab] = useState<Tab>("contacts");

  if (!me.isAdmin) {
    // Executives don't get contacts/events — just their own team.
    return (
      <div className="mt-10 pt-10 border-t border-dashed border-border-strong">
        <div className="flex items-center gap-2 mb-1">
          <Users size={17} className="text-teal" />
          <h3 className="font-display text-xl">Your team</h3>
        </div>
        <p className="text-[13px] mb-5 text-ink-faint">The staff accounts assigned to you.</p>
        <TeamPanel onToast={onToast} />
      </div>
    );
  }

  return (
    <div className="mt-10 pt-10 border-t border-dashed border-border-strong">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck size={17} className="text-teal" />
        <h3 className="font-display text-xl">Admin</h3>
      </div>
      <p className="text-[13px] mb-5 text-ink-faint">Manage what the public site shows and who can sign in as staff.</p>

      <div className="flex gap-1.5 mb-6 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`text-[13px] font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
              tab === t.key ? "bg-teal text-white border-teal" : "border-border-strong text-ink-faint"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {tab === "contacts" && <ContactsPanel onToast={onToast} />}
          {tab === "events" && <EventsPanel onToast={onToast} />}
          {tab === "staff" && <StaffPanel currentUserId={me.userId} onToast={onToast} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function panelError(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback;
}

// ---------------------------------------------------------------------

function ContactsPanel({ onToast }: { onToast: (msg: string) => void }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Contact | "new" | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      setContacts(await listContacts());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    try {
      await adminUpsertContact({
        id: editing !== "new" && editing ? editing.id : undefined,
        label: data.label,
        phone: data.phone,
        email: data.email,
        address: data.address,
        whatsapp: data.whatsapp,
        sortOrder: Number(data.sortOrder) || 0,
      });
      onToast("Contact saved. It's live on the site now.");
      setEditing(null);
      void refresh();
    } catch (err) {
      onToast(panelError(err, "Couldn't save that contact."));
    }
  };

  const remove = async (c: Contact) => {
    if (!window.confirm(`Delete "${c.label}" from the site?`)) return;
    try {
      await adminDeleteContact(c.id);
      onToast("Contact removed.");
      void refresh();
    } catch (err) {
      onToast(panelError(err, "Couldn't delete that contact."));
    }
  };

  return (
    <div>
      <button
        onClick={() => setEditing("new")}
        className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-md bg-teal text-white mb-4 active:scale-[0.97] transition-transform"
      >
        <Plus size={15} /> Add contact
      </button>

      {loading ? (
        <div className="shimmer rounded-lg h-16 animate-shimmer" />
      ) : contacts.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center border-border-strong text-ink-faint text-[13px]">
          No contacts yet — add one so it shows up on the site.
        </div>
      ) : (
        <div className="space-y-2">
          {contacts.map((c) => (
            <div key={c.id} className="rounded-lg border border-border p-3.5 bg-cream-card flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[14px] font-medium">{c.label}</div>
                <div className="text-[12px] text-ink-faint flex flex-wrap gap-x-3">
                  {c.phone && <span>{c.phone}</span>}
                  {c.email && <span>{c.email}</span>}
                  {c.address && <span className="truncate">{c.address}</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditing(c)} className="p-2 rounded-md border border-border-strong text-ink-soft">
                  <Pencil size={14} />
                </button>
                <button onClick={() => remove(c)} className="p-2 rounded-md border border-border-strong text-[#8A3B22]">
                  <Trash2 size={14} />
                </button>
              </div>
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
            onClick={() => setEditing(null)}
          >
            <motion.form
              onSubmit={save}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm rounded-xl p-6 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-display text-lg mb-4">{editing === "new" ? "Add contact" : "Edit contact"}</div>
              <input name="label" placeholder="Label (e.g. Head office)" defaultValue={editing !== "new" ? editing.label : ""} required className={`${inputClass} mb-3`} />
              <input name="phone" placeholder="Phone" defaultValue={editing !== "new" ? (editing.phone ?? "") : ""} className={`${inputClass} mb-3`} />
              <input name="whatsapp" placeholder="WhatsApp" defaultValue={editing !== "new" ? (editing.whatsapp ?? "") : ""} className={`${inputClass} mb-3`} />
              <input name="email" type="email" placeholder="Email" defaultValue={editing !== "new" ? (editing.email ?? "") : ""} className={`${inputClass} mb-3`} />
              <input name="address" placeholder="Address" defaultValue={editing !== "new" ? (editing.address ?? "") : ""} className={`${inputClass} mb-3`} />
              <input name="sortOrder" type="number" placeholder="Order (0 = first)" defaultValue={editing !== "new" ? editing.sortOrder : 0} className={`${inputClass} mb-4`} />
              <button type="submit" className="w-full py-2.5 rounded-md font-medium text-[14px] bg-teal text-white">
                Save
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------

function EventsPanel({ onToast }: { onToast: (msg: string) => void }) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EventItem | "new" | null>(null);
  const [uploadingFor, setUploadingFor] = useState<number | null>(null);

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

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    try {
      await adminUpsertEvent({
        id: editing !== "new" && editing ? editing.id : undefined,
        title: data.title,
        description: data.description,
        eventDate: data.eventDate || undefined,
        location: data.location,
      });
      onToast("Event saved.");
      setEditing(null);
      void refresh();
    } catch (err) {
      onToast(panelError(err, "Couldn't save that event."));
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
        onClick={() => setEditing("new")}
        className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-md bg-teal text-white mb-4 active:scale-[0.97] transition-transform"
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
            <div key={ev.id} className="rounded-lg border border-border p-3.5 bg-cream-card">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <div className="text-[14px] font-medium">{ev.title}</div>
                  <div className="text-[12px] text-ink-faint">
                    {ev.eventDate ?? "No date"} {ev.location ? `· ${ev.location}` : ""}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setEditing(ev)} className="p-2 rounded-md border border-border-strong text-ink-soft">
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
            onClick={() => setEditing(null)}
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
              <input name="location" placeholder="Location" defaultValue={editing !== "new" ? (editing.location ?? "") : ""} className={`${inputClass} mb-4`} />
              <button type="submit" className="w-full py-2.5 rounded-md font-medium text-[14px] bg-teal text-white">
                Save
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------
// Admin's full staff view — every account, grouped by executive so it
// reads as an org chart: admins, then each executive with their staff
// nested underneath, then anyone not yet assigned to an executive.

function StaffPanel({ currentUserId, onToast }: { currentUserId: string; onToast: (msg: string) => void }) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [addRole, setAddRole] = useState<StaffRole>("staff");
  const [resetting, setResetting] = useState<StaffMember | null>(null);
  const [editingRole, setEditingRole] = useState<StaffMember | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      setStaff(await adminListStaff());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const executives = staff.filter((s) => s.role === "executive");
  const admins = staff.filter((s) => s.role === "admin");
  const unassignedStaff = staff.filter((s) => s.role === "staff" && !s.managerId);
  const staffFor = (execId: string) => staff.filter((s) => s.role === "staff" && s.managerId === execId);

  const create = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    try {
      await adminCreateStaff(data.email, data.password, addRole, data.managerId || null);
      onToast(`${ROLE_LABEL[addRole]} account created for ${data.email}.`);
      setAdding(false);
      setAddRole("staff");
      void refresh();
    } catch (err) {
      onToast(panelError(err, "Couldn't create that account."));
    }
  };

  const saveRole = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingRole) return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const role = data.role as StaffRole;
    try {
      await adminSetStaffRole(editingRole.userId, role, role === "staff" ? data.managerId || null : null);
      onToast(`${editingRole.email} is now ${ROLE_LABEL[role].toLowerCase()}.`);
      setEditingRole(null);
      void refresh();
    } catch (err) {
      onToast(panelError(err, "Couldn't update that account."));
    }
  };

  const remove = async (member: StaffMember) => {
    if (!window.confirm(`Remove staff access for ${member.email}?`)) return;
    try {
      await adminRemoveStaff(member.userId);
      onToast(`${member.email} no longer has staff access.`);
      void refresh();
    } catch (err) {
      onToast(panelError(err, "Couldn't remove that account."));
    }
  };

  const resetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resetting) return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    try {
      await adminResetStaffPassword(resetting.userId, data.newPassword);
      onToast(`Password reset for ${resetting.email}. Share the new password with them securely.`);
      setResetting(null);
    } catch (err) {
      onToast(panelError(err, "Couldn't reset that password."));
    }
  };

  const Row = ({ m, indent }: { m: StaffMember; indent?: boolean }) => (
    <div className={`rounded-lg border border-border p-3.5 bg-cream-card flex items-center justify-between gap-3 ${indent ? "ml-6" : ""}`}>
      <div className="min-w-0 flex items-center gap-2">
        {m.role === "admin" ? (
          <ShieldCheck size={15} className="text-teal shrink-0" />
        ) : m.role === "executive" ? (
          <Users size={15} className="text-teal shrink-0" />
        ) : (
          <Shield size={15} className="text-ink-faint shrink-0" />
        )}
        <div>
          <div className="text-[14px] font-medium">{m.email}</div>
          <div className="text-[12px] text-ink-faint">{ROLE_LABEL[m.role]}</div>
        </div>
      </div>
      {m.userId !== currentUserId ? (
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setEditingRole(m)} className="text-[12px] font-medium px-2.5 py-1.5 rounded-md border border-border-strong text-ink-soft">
            Change role
          </button>
          <button
            onClick={() => setResetting(m)}
            className="flex items-center gap-1 text-[12px] font-medium px-2.5 py-1.5 rounded-md border border-border-strong text-ink-soft"
          >
            <KeyRound size={12} /> Reset password
          </button>
          <button onClick={() => remove(m)} className="p-2 rounded-md border border-border-strong text-[#8A3B22]">
            <Trash2 size={14} />
          </button>
        </div>
      ) : (
        <span className="text-[12px] shrink-0 text-ink-faint">You</span>
      )}
    </div>
  );

  return (
    <div>
      <button
        onClick={() => setAdding(true)}
        className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-md bg-teal text-white mb-4 active:scale-[0.97] transition-transform"
      >
        <Plus size={15} /> Add staff account
      </button>

      {loading ? (
        <div className="shimmer rounded-lg h-16 animate-shimmer" />
      ) : staff.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center border-border-strong text-ink-faint text-[13px]">
          No staff accounts yet.
        </div>
      ) : (
        <div className="space-y-2">
          {admins.map((m) => (
            <Row key={m.userId} m={m} />
          ))}
          {executives.map((exec) => (
            <div key={exec.userId} className="space-y-2">
              <Row m={exec} />
              {staffFor(exec.userId).map((m) => (
                <Row key={m.userId} m={m} indent />
              ))}
            </div>
          ))}
          {unassignedStaff.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-wide text-ink-faint pt-2">Not assigned to an executive</div>
              {unassignedStaff.map((m) => (
                <Row key={m.userId} m={m} />
              ))}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60"
            onClick={() => setAdding(false)}
          >
            <motion.form
              onSubmit={create}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm rounded-xl p-6 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-display text-lg mb-1">New staff account</div>
              <p className="text-[13px] mb-4 text-ink-faint">Choose their email and a starting password — share it with them securely.</p>
              <input name="email" type="email" placeholder="Email" required className={`${inputClass} mb-3`} />
              <input name="password" type="text" placeholder="Password (min. 8 characters)" required minLength={8} className={`${inputClass} mb-3`} />
              <label className="block text-[12px] font-medium text-ink-faint mb-1.5">Role</label>
              <select
                name="role"
                value={addRole}
                onChange={(e) => setAddRole(e.target.value as StaffRole)}
                className={`${inputClass} mb-3`}
              >
                <option value="staff">Staff</option>
                <option value="executive">Executive</option>
                <option value="admin">Admin</option>
              </select>
              {addRole === "staff" && executives.length > 0 && (
                <>
                  <label className="block text-[12px] font-medium text-ink-faint mb-1.5">Reports to (optional)</label>
                  <select name="managerId" defaultValue="" className={`${inputClass} mb-4`}>
                    <option value="">Not assigned yet</option>
                    {executives.map((exec) => (
                      <option key={exec.userId} value={exec.userId}>
                        {exec.email}
                      </option>
                    ))}
                  </select>
                </>
              )}
              <button type="submit" className="w-full py-2.5 rounded-md font-medium text-[14px] bg-teal text-white">
                Create account
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60"
            onClick={() => setEditingRole(null)}
          >
            <motion.form
              onSubmit={saveRole}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm rounded-xl p-6 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-display text-lg mb-1">Change role</div>
              <p className="text-[13px] mb-4 text-ink-faint">For {editingRole.email}.</p>
              <label className="block text-[12px] font-medium text-ink-faint mb-1.5">Role</label>
              <select name="role" defaultValue={editingRole.role} className={`${inputClass} mb-3`}>
                <option value="staff">Staff</option>
                <option value="executive">Executive</option>
                <option value="admin">Admin</option>
              </select>
              <label className="block text-[12px] font-medium text-ink-faint mb-1.5">Reports to (only applies if role is Staff)</label>
              <select name="managerId" defaultValue={editingRole.managerId ?? ""} className={`${inputClass} mb-4`}>
                <option value="">Not assigned</option>
                {executives
                  .filter((exec) => exec.userId !== editingRole.userId)
                  .map((exec) => (
                    <option key={exec.userId} value={exec.userId}>
                      {exec.email}
                    </option>
                  ))}
              </select>
              <button type="submit" className="w-full py-2.5 rounded-md font-medium text-[14px] bg-teal text-white">
                Save
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {resetting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60"
            onClick={() => setResetting(null)}
          >
            <motion.form
              onSubmit={resetPassword}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm rounded-xl p-6 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-display text-lg mb-1">Reset password</div>
              <p className="text-[13px] mb-4 text-ink-faint">
                For {resetting.email}. This immediately replaces their current password — share the
                new one with them securely.
              </p>
              <input name="newPassword" type="text" placeholder="New password (min. 8 characters)" required minLength={8} className={`${inputClass} mb-4`} />
              <button type="submit" className="w-full py-2.5 rounded-md font-medium text-[14px] bg-teal text-white">
                Reset password
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------
// An executive's scoped view: just the staff assigned to them. No
// contacts/events, no visibility into other executives' teams, and no
// account-creation button — an admin assigns staff to them.

function TeamPanel({ onToast }: { onToast: (msg: string) => void }) {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState<TeamMember | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      setTeam(await executiveListStaff());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const remove = async (member: TeamMember) => {
    if (!window.confirm(`Remove staff access for ${member.email}?`)) return;
    try {
      await executiveRemoveStaff(member.userId);
      onToast(`${member.email} no longer has staff access.`);
      void refresh();
    } catch (err) {
      onToast(panelError(err, "Couldn't remove that account."));
    }
  };

  const resetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resetting) return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    try {
      await adminResetStaffPassword(resetting.userId, data.newPassword);
      onToast(`Password reset for ${resetting.email}. Share the new password with them securely.`);
      setResetting(null);
    } catch (err) {
      onToast(panelError(err, "Couldn't reset that password."));
    }
  };

  if (loading) return <div className="shimmer rounded-lg h-16 animate-shimmer" />;

  if (team.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center border-border-strong text-ink-faint text-[13px]">
        No staff assigned to you yet — an admin assigns staff to your team.
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2">
        {team.map((m) => (
          <div key={m.userId} className="rounded-lg border border-border p-3.5 bg-cream-card flex items-center justify-between gap-3">
            <div className="min-w-0 flex items-center gap-2">
              <Shield size={15} className="text-ink-faint shrink-0" />
              <div className="text-[14px] font-medium">{m.email}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setResetting(m)}
                className="flex items-center gap-1 text-[12px] font-medium px-2.5 py-1.5 rounded-md border border-border-strong text-ink-soft"
              >
                <KeyRound size={12} /> Reset password
              </button>
              <button onClick={() => remove(m)} className="p-2 rounded-md border border-border-strong text-[#8A3B22]">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {resetting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60"
            onClick={() => setResetting(null)}
          >
            <motion.form
              onSubmit={resetPassword}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm rounded-xl p-6 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-display text-lg mb-1">Reset password</div>
              <p className="text-[13px] mb-4 text-ink-faint">
                For {resetting.email}. This immediately replaces their current password — share the
                new one with them securely.
              </p>
              <input name="newPassword" type="text" placeholder="New password (min. 8 characters)" required minLength={8} className={`${inputClass} mb-4`} />
              <button type="submit" className="w-full py-2.5 rounded-md font-medium text-[14px] bg-teal text-white">
                Reset password
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
