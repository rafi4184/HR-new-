import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Pencil, Plus, ShieldCheck, Shield, Users, KeyRound, ScrollText, CalendarDays, FileText, Download } from "lucide-react";
import { inputClass } from "../ui/Field";
import EventsManager from "../EventsManager";
import {
  listContacts,
  adminUpsertContact,
  adminDeleteContact,
  adminListStaff,
  adminCreateStaff,
  adminResetStaffPassword,
  adminSetStaffRole,
  adminRemoveStaff,
  executiveListStaff,
  executiveRemoveStaff,
  adminListAuditLog,
  staffListResumes,
  staffReviewResume,
  getResumeDownloadUrl,
  adminSetSiteContent,
  ApiError,
} from "../../lib/api";
import { SITE_CONTENT_KEYS, useSiteContentRaw, useReloadSiteContent } from "../../lib/siteContent";
import type { AuditLogEntry, Contact, ResumeSubmission, StaffMember, StaffRole, TeamMember, WhoAmI } from "../../types";

type Tab = "contacts" | "events" | "resumes" | "content" | "staff" | "audit";

const TABS: { key: Tab; label: string }[] = [
  { key: "contacts", label: "Contacts" },
  { key: "events", label: "Events" },
  { key: "resumes", label: "Resumes" },
  { key: "content", label: "Site Content" },
  { key: "staff", label: "Staff" },
  { key: "audit", label: "Audit log" },
];

const ACTION_LABEL: Record<string, string> = {
  approve_request: "Approved request",
  reject_request: "Rejected request",
  complete_request: "Completed request",
  delete_request: "Deleted request",
  create_staff: "Created account",
  remove_staff: "Removed access",
  set_staff_role: "Changed role",
  set_staff_admin: "Changed admin access",
  reset_password: "Reset password",
  login: "Logged in",
  logout: "Logged out",
  create_event: "Created event",
  update_event: "Updated event",
  delete_event: "Deleted event",
  add_event_media: "Added event media",
  delete_event_media: "Removed event media",
  set_site_content: "Edited site content",
  review_resume: "Reviewed resume",
};

const ROLE_LABEL: Record<StaffRole, string> = { admin: "Admin", executive: "Executive", staff: "Staff" };

export default function AdminPanel({
  me,
  onToast,
}: {
  me: WhoAmI;
  onToast: (msg: string) => void;
}) {
  const [tab, setTab] = useState<Tab>("contacts");

  if (me.role === "staff") {
    // Plain staff don't get contacts/staff-management/audit — just events
    // and resumes, so they can post recent success stories and seminars,
    // and review jobseeker resumes, themselves.
    return (
      <div className="mt-10 pt-10 border-t border-dashed border-border-strong">
        <div className="flex items-center gap-2 mb-1">
          <CalendarDays size={17} className="text-navy" />
          <h3 className="font-display text-xl">Events</h3>
        </div>
        <p className="text-[13px] mb-5 text-ink-faint">
          Post recent success stories and seminars — everyone visiting the site will see them.
        </p>
        <EventsManager onToast={onToast} />

        <div className="flex items-center gap-2 mb-1 mt-10 pt-10 border-t border-dashed border-border-strong">
          <FileText size={17} className="text-navy" />
          <h3 className="font-display text-xl">Resumes</h3>
        </div>
        <p className="text-[13px] mb-5 text-ink-faint">Jobseeker resumes submitted for employment placement.</p>
        <ResumesPanel onToast={onToast} />

        <div className="flex items-center gap-2 mb-1 mt-10 pt-10 border-t border-dashed border-border-strong">
          <Pencil size={17} className="text-navy" />
          <h3 className="font-display text-xl">Site Content</h3>
        </div>
        <p className="text-[13px] mb-5 text-ink-faint">Edit the wording visitors see on key pages, in English and Bangla.</p>
        <ContentPanel onToast={onToast} />
      </div>
    );
  }

  if (!me.isAdmin) {
    // Executives don't get contacts/events — just their own team.
    return (
      <div className="mt-10 pt-10 border-t border-dashed border-border-strong">
        <div className="flex items-center gap-2 mb-1">
          <Users size={17} className="text-navy" />
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
        <ShieldCheck size={17} className="text-navy" />
        <h3 className="font-display text-xl">Admin</h3>
      </div>
      <p className="text-[13px] mb-5 text-ink-faint">Manage what the public site shows and who can sign in as staff.</p>

      <div className="flex gap-1.5 mb-6 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`text-[13px] font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
              tab === t.key ? "bg-navy text-white border-navy" : "border-border-strong text-ink-faint"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {tab === "contacts" && <ContactsPanel onToast={onToast} />}
          {tab === "events" && <EventsManager onToast={onToast} />}
          {tab === "resumes" && <ResumesPanel onToast={onToast} />}
          {tab === "content" && <ContentPanel onToast={onToast} />}
          {tab === "staff" && <StaffPanel currentUserId={me.userId} onToast={onToast} />}
          {tab === "audit" && <AuditLogPanel />}
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
        className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-md bg-navy text-white mb-4 active:scale-[0.97] transition-transform"
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
            <div key={c.id} className="rounded-lg border border-border p-3.5 bg-white flex items-center justify-between gap-3">
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
              <button type="submit" className="w-full py-2.5 rounded-md font-medium text-[14px] bg-navy text-white">
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
      await adminCreateStaff(data.staffId, data.password, addRole, data.managerId || null);
      onToast(`${ROLE_LABEL[addRole]} account created for Staff ID "${data.staffId}".`);
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
      onToast(`${editingRole.staffId} is now ${ROLE_LABEL[role].toLowerCase()}.`);
      setEditingRole(null);
      void refresh();
    } catch (err) {
      onToast(panelError(err, "Couldn't update that account."));
    }
  };

  const remove = async (member: StaffMember) => {
    if (!window.confirm(`Remove staff access for "${member.staffId}"?`)) return;
    try {
      await adminRemoveStaff(member.userId);
      onToast(`"${member.staffId}" no longer has staff access.`);
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
      onToast(`Password reset for "${resetting.staffId}". Share the new password with them securely.`);
      setResetting(null);
    } catch (err) {
      onToast(panelError(err, "Couldn't reset that password."));
    }
  };

  const Row = ({ m, indent }: { m: StaffMember; indent?: boolean }) => (
    <div className={`rounded-lg border border-border p-3.5 bg-white flex items-center justify-between gap-3 ${indent ? "ml-6" : ""}`}>
      <div className="min-w-0 flex items-center gap-2">
        {m.role === "admin" ? (
          <ShieldCheck size={15} className="text-navy shrink-0" />
        ) : m.role === "executive" ? (
          <Users size={15} className="text-navy shrink-0" />
        ) : (
          <Shield size={15} className="text-ink-faint shrink-0" />
        )}
        <div>
          <div className="text-[14px] font-medium">{m.staffId}</div>
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
        className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-md bg-navy text-white mb-4 active:scale-[0.97] transition-transform"
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
              <p className="text-[13px] mb-4 text-ink-faint">
                Choose a Staff ID and a starting password — no email needed. Share both with them securely.
              </p>
              <input
                name="staffId"
                type="text"
                placeholder="Staff ID (e.g. staff-014)"
                required
                minLength={2}
                maxLength={32}
                pattern="[a-zA-Z0-9._-]+"
                title="Letters, numbers, dots, dashes or underscores only"
                className={`${inputClass} mb-3`}
              />
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
                        {exec.staffId}
                      </option>
                    ))}
                  </select>
                </>
              )}
              <button type="submit" className="w-full py-2.5 rounded-md font-medium text-[14px] bg-navy text-white">
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
              <p className="text-[13px] mb-4 text-ink-faint">For {editingRole.staffId}.</p>
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
                      {exec.staffId}
                    </option>
                  ))}
              </select>
              <button type="submit" className="w-full py-2.5 rounded-md font-medium text-[14px] bg-navy text-white">
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
                For {resetting.staffId}. This immediately replaces their current password — share the
                new one with them securely.
              </p>
              <input name="newPassword" type="text" placeholder="New password (min. 8 characters)" required minLength={8} className={`${inputClass} mb-4`} />
              <button type="submit" className="w-full py-2.5 rounded-md font-medium text-[14px] bg-navy text-white">
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
    if (!window.confirm(`Remove staff access for "${member.staffId}"?`)) return;
    try {
      await executiveRemoveStaff(member.userId);
      onToast(`"${member.staffId}" no longer has staff access.`);
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
      onToast(`Password reset for "${resetting.staffId}". Share the new password with them securely.`);
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
          <div key={m.userId} className="rounded-lg border border-border p-3.5 bg-white flex items-center justify-between gap-3">
            <div className="min-w-0 flex items-center gap-2">
              <Shield size={15} className="text-ink-faint shrink-0" />
              <div className="text-[14px] font-medium">{m.staffId}</div>
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
                For {resetting.staffId}. This immediately replaces their current password — share the
                new one with them securely.
              </p>
              <input name="newPassword" type="text" placeholder="New password (min. 8 characters)" required minLength={8} className={`${inputClass} mb-4`} />
              <button type="submit" className="w-full py-2.5 rounded-md font-medium text-[14px] bg-navy text-white">
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
// Read-only history of every consequential action — who (by Staff ID),
// what, on what, and when. Written server-side by the same functions
// that do the work, so nothing here can be forged or quietly skipped.

const ACTION_TONE: Record<string, string> = {
  approve_request: "bg-[#DCEEDC] text-[#2A6B2F]",
  complete_request: "bg-[#DCEEDC] text-[#2A6B2F]",
  reject_request: "bg-[#F7E3DD] text-[#8A3B22]",
  remove_staff: "bg-[#F7E3DD] text-[#8A3B22]",
  delete_request: "bg-[#F7E3DD] text-[#8A3B22]",
  delete_event: "bg-[#F7E3DD] text-[#8A3B22]",
  delete_event_media: "bg-[#F7E3DD] text-[#8A3B22]",
  create_staff: "bg-gold-pale text-gold-deep",
  set_staff_role: "bg-gold-pale text-gold-deep",
  set_staff_admin: "bg-gold-pale text-gold-deep",
  create_event: "bg-gold-pale text-gold-deep",
  update_event: "bg-gold-pale text-gold-deep",
  add_event_media: "bg-gold-pale text-gold-deep",
  reset_password: "bg-[#F4E7C9] text-[#8A6A12]",
  login: "bg-paper-panel text-ink-soft",
  logout: "bg-paper-panel text-ink-soft",
};

function describeMetadata(entry: AuditLogEntry): string {
  return Object.entries(entry.metadata)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
    .join(" · ");
}

const ACTION_FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "login", label: "Logins" },
  { key: "logout", label: "Logouts" },
  { key: "approve_request", label: "Approved" },
  { key: "reject_request", label: "Rejected" },
  { key: "complete_request", label: "Completed" },
  { key: "delete_request", label: "Deleted request" },
  { key: "create_event", label: "Event created" },
  { key: "update_event", label: "Event updated" },
  { key: "delete_event", label: "Event deleted" },
  { key: "create_staff", label: "Account created" },
  { key: "remove_staff", label: "Access removed" },
  { key: "set_staff_role", label: "Role changed" },
  { key: "set_staff_admin", label: "Admin access changed" },
  { key: "reset_password", label: "Password reset" },
];

const TIME_FILTERS: { key: string; label: string; ms: number | null }[] = [
  { key: "24h", label: "24H", ms: 24 * 60 * 60 * 1000 },
  { key: "7d", label: "7D", ms: 7 * 24 * 60 * 60 * 1000 },
  { key: "30d", label: "30D", ms: 30 * 24 * 60 * 60 * 1000 },
  { key: "all", label: "All time", ms: null },
];

function AuditLogPanel() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [actorQuery, setActorQuery] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setEntries(await adminListAuditLog(200));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const timeCutoffMs = TIME_FILTERS.find((t) => t.key === timeFilter)?.ms ?? null;
  const now = Date.now();
  const query = actorQuery.trim().toLowerCase();
  const filtered = entries.filter((e) => {
    if (actionFilter !== "all" && e.action !== actionFilter) return false;
    if (timeCutoffMs !== null && now - new Date(e.createdAt).getTime() > timeCutoffMs) return false;
    if (query && !(e.actorStaffId ?? "").toLowerCase().includes(query)) return false;
    return true;
  });

  if (loading) return <div className="shimmer rounded-lg h-16 animate-shimmer" />;

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        <span className="text-[11px] font-medium uppercase tracking-wide text-ink-faint mr-1">Filter</span>
        {ACTION_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActionFilter(f.key)}
            className={`text-[12px] font-medium px-3 py-1.5 rounded-full border transition-colors ${
              actionFilter === f.key ? "bg-navy text-white border-navy" : "border-border-strong text-ink-faint"
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="w-px h-5 bg-border-strong mx-1" />
        {TIME_FILTERS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTimeFilter(t.key)}
            className={`text-[12px] font-medium px-3 py-1.5 rounded-full border transition-colors ${
              timeFilter === t.key ? "bg-navy text-white border-navy" : "border-border-strong text-ink-faint"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <input
        value={actorQuery}
        onChange={(e) => setActorQuery(e.target.value)}
        placeholder="Filter by actor…"
        className={`${inputClass} mb-4 max-w-xs`}
      />

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center border-border-strong text-ink-faint text-[13px]">
          {entries.length === 0
            ? "Nothing logged yet — every approval, rejection, and staff change will show up here."
            : "No entries match these filters."}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((entry) => (
            <div key={entry.id} className="rounded-lg border border-border p-3.5 bg-white flex items-start gap-3">
              <ScrollText size={15} className="text-ink-faint shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${ACTION_TONE[entry.action] ?? "bg-navy-light text-ink-faint"}`}>
                    {ACTION_LABEL[entry.action] ?? entry.action}
                  </span>
                  <span className="text-[12px] text-ink-faint">by {entry.actorStaffId ?? "unknown"}</span>
                </div>
                {describeMetadata(entry) && <div className="text-[13px]">{describeMetadata(entry)}</div>}
              </div>
              <span className="text-[11px] text-ink-faint shrink-0 whitespace-nowrap">
                {new Date(entry.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------

const RESUME_STATUS_LABEL: Record<ResumeSubmission["status"], string> = {
  new: "New",
  reviewed: "Reviewed",
  contacted: "Contacted",
};

const RESUME_STATUS_TONE: Record<ResumeSubmission["status"], string> = {
  new: "bg-gold-pale text-gold-deep",
  reviewed: "bg-paper-panel text-ink-soft",
  contacted: "bg-[#DCEEDC] text-[#2A6B2F]",
};

function ResumesPanel({ onToast }: { onToast: (msg: string) => void }) {
  const [resumes, setResumes] = useState<ResumeSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | ResumeSubmission["status"]>("all");
  const [busyId, setBusyId] = useState<number | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      setResumes(await staffListResumes());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const download = async (r: ResumeSubmission) => {
    try {
      const url = await getResumeDownloadUrl(r.storagePath);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      onToast(panelError(err, "Couldn't open that resume."));
    }
  };

  const setStatus = async (r: ResumeSubmission, status: ResumeSubmission["status"]) => {
    setBusyId(r.id);
    try {
      await staffReviewResume(r.id, status);
      onToast(`Marked as ${RESUME_STATUS_LABEL[status].toLowerCase()}.`);
      void refresh();
    } catch (err) {
      onToast(panelError(err, "Couldn't update that resume."));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div className="shimmer rounded-lg h-16 animate-shimmer" />;

  const filtered = statusFilter === "all" ? resumes : resumes.filter((r) => r.status === statusFilter);

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
        <span className="text-[11px] font-medium uppercase tracking-wide text-ink-faint mr-1">Filter</span>
        {(["all", "new", "reviewed", "contacted"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-[12px] font-medium px-3 py-1.5 rounded-full border transition-colors ${
              statusFilter === s ? "bg-navy text-white border-navy" : "border-border-strong text-ink-faint"
            }`}
          >
            {s === "all" ? "All" : RESUME_STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center border-border-strong text-ink-faint text-[13px]">
          {resumes.length === 0 ? "No resumes submitted yet." : "No resumes match this filter."}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-lg border border-border p-4 bg-white">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-display text-[15px] text-navy">{r.name}</span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${RESUME_STATUS_TONE[r.status]}`}>
                      {RESUME_STATUS_LABEL[r.status]}
                    </span>
                  </div>
                  <div className="text-[12.5px] text-ink-faint">
                    {r.email}
                    {r.phone ? ` · ${r.phone}` : ""}
                  </div>
                  {(r.targetRole || r.targetCountry) && (
                    <div className="text-[12.5px] text-ink-soft mt-0.5">
                      {[r.targetRole, r.targetCountry].filter(Boolean).join(" · ")}
                    </div>
                  )}
                  {r.note && <div className="text-[13px] text-ink-soft mt-1.5">{r.note}</div>}
                </div>
                <span className="text-[11px] text-ink-faint whitespace-nowrap">{new Date(r.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-2.5">
                <button
                  onClick={() => download(r)}
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-medium px-3 py-1.5 rounded-full border border-border-strong text-ink-soft hover:border-navy hover:text-navy transition-colors"
                >
                  <Download size={13} /> {r.fileName}
                </button>
                {r.status !== "reviewed" && (
                  <button
                    disabled={busyId === r.id}
                    onClick={() => setStatus(r, "reviewed")}
                    className="text-[12.5px] font-medium px-3 py-1.5 rounded-full border border-border-strong text-ink-soft hover:border-navy hover:text-navy transition-colors disabled:opacity-50"
                  >
                    Mark reviewed
                  </button>
                )}
                {r.status !== "contacted" && (
                  <button
                    disabled={busyId === r.id}
                    onClick={() => setStatus(r, "contacted")}
                    className="text-[12.5px] font-medium px-3 py-1.5 rounded-full border border-border-strong text-ink-soft hover:border-navy hover:text-navy transition-colors disabled:opacity-50"
                  >
                    Mark contacted
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------

function ContentPanel({ onToast }: { onToast: (msg: string) => void }) {
  const groups = Array.from(new Set(SITE_CONTENT_KEYS.map((d) => d.group)));
  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group}>
          <h4 className="font-display text-base text-navy mb-3">{group}</h4>
          <div className="space-y-4">
            {SITE_CONTENT_KEYS.filter((d) => d.group === group).map((def) => (
              <ContentField key={def.key} field={def} onToast={onToast} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ContentField({
  field,
  onToast,
}: {
  field: (typeof SITE_CONTENT_KEYS)[number];
  onToast: (msg: string) => void;
}) {
  const current = useSiteContentRaw(field.key);
  const reload = useReloadSiteContent();
  const [valueEn, setValueEn] = useState(current.en);
  const [valueBn, setValueBn] = useState(current.bn);
  const [saving, setSaving] = useState(false);

  const dirty = valueEn !== current.en || valueBn !== current.bn;
  const Box = field.multiline ? "textarea" : "input";

  const save = async () => {
    setSaving(true);
    try {
      await adminSetSiteContent(field.key, valueEn, valueBn);
      reload();
      onToast(`Updated "${field.label}".`);
    } catch (err) {
      onToast(panelError(err, "Couldn't save that field."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg border border-border p-4 bg-white">
      <div className="text-[13px] font-medium text-navy mb-3">{field.label}</div>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="block text-[11px] mb-1 text-ink-faint uppercase tracking-wide">English</span>
          <Box
            value={valueEn}
            onChange={(e) => setValueEn(e.target.value)}
            rows={field.multiline ? 3 : undefined}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="block text-[11px] mb-1 text-ink-faint uppercase tracking-wide">বাংলা</span>
          <Box
            value={valueBn}
            onChange={(e) => setValueBn(e.target.value)}
            rows={field.multiline ? 3 : undefined}
            className={inputClass}
          />
        </label>
      </div>
      <button
        onClick={save}
        disabled={!dirty || saving}
        className="mt-3 text-[12.5px] font-medium px-4 py-1.5 rounded-full bg-navy text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
