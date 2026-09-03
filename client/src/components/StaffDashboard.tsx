import { useMemo, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, CheckCircle2, XCircle, Clock3, Loader2, Phone, Mail, KeyRound, Eye, X } from "lucide-react";
import { inputClass } from "./ui/Field";
import StatusPill from "./ui/StatusPill";
import Reveal from "./ui/Reveal";
import AnimatedCounter from "./ui/AnimatedCounter";
import AdminPanel from "./admin/AdminPanel";
import {
  staffApprove,
  staffReject,
  staffComplete,
  staffListRequests,
  staffLogin,
  staffLogout,
  whoami,
  changePassword,
  ApiError,
} from "../lib/api";
import type { ServiceRequest, WhoAmI } from "../types";

const STAT_TILES = [
  { key: "new", label: "New", icon: Clock3, className: "bg-[#F4E7C9] text-[#8A6A12]" },
  { key: "active", label: "In progress", icon: Loader2, className: "bg-teal-pale text-teal" },
  { key: "completed", label: "Completed", icon: CheckCircle2, className: "bg-[#DCEEDC] text-[#2A6B2F]" },
  { key: "rejected", label: "Not approved", icon: XCircle, className: "bg-[#F7E3DD] text-[#8A3B22]" },
] as const;

function countByStatus(requests: ServiceRequest[]) {
  return {
    new: requests.filter((r) => r.status === "received").length,
    active: requests.filter((r) => r.status === "approved" || r.status === "paid").length,
    completed: requests.filter((r) => r.status === "completed").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };
}

export default function StaffDashboard({ onToast }: { onToast: (msg: string) => void }) {
  const [token, setToken] = useState<string | null>(null);
  const [me, setMe] = useState<WhoAmI | null>(null);
  const [pinOpen, setPinOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [viewing, setViewing] = useState<ServiceRequest | null>(null);
  const stats = useMemo(() => countByStatus(requests), [requests]);

  const refresh = async (t: string) => {
    setLoading(true);
    try {
      setRequests(await staffListRequests(t));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    try {
      const { token: t } = await staffLogin(data.staffId, data.password);
      setToken(t);
      setPinOpen(false);
      onToast("Staff mode enabled.");
      refresh(t);
      whoami()
        .then(setMe)
        .catch(() => setMe(null));
    } catch (err) {
      setLoginError(err instanceof ApiError ? err.message : "Sign-in failed.");
    }
    form.reset();
  };

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (data.newPassword !== data.confirmPassword) {
      onToast("Passwords don't match.");
      return;
    }
    try {
      await changePassword(data.newPassword);
      onToast("Password updated.");
      setAccountOpen(false);
      form.reset();
    } catch (err) {
      onToast(err instanceof ApiError ? err.message : "Couldn't update your password.");
    }
  };

  const approve = async (id: number) => {
    if (!token) return;
    const target = requests.find((r) => r.id === id);
    if (!target) return;
    let fee: number | undefined;
    if (target.type === "Government Request") {
      const input = window.prompt("Set the service fee for this case (BDT):", "3000");
      if (input === null) return;
      fee = Number(input.replace(/[^0-9]/g, "")) || 0;
    }
    try {
      const updated = await staffApprove(token, id, fee);
      setRequests((rs) => rs.map((r) => (r.id === id ? updated : r)));
      onToast(`${updated.ticket} approved. Confirmation sent automatically to ${updated.email}.`);
    } catch (err) {
      onToast(err instanceof ApiError ? err.message : "Couldn't approve that request.");
    }
  };

  const reject = async (id: number) => {
    if (!token) return;
    const target = requests.find((r) => r.id === id);
    if (!target) return;
    if (!window.confirm(`Reject ${target.ticket}? The customer will be notified automatically.`)) return;
    const note = window.prompt("Add a note for the customer (optional):", "") ?? undefined;
    try {
      const updated = await staffReject(token, id, note);
      setRequests((rs) => rs.map((r) => (r.id === id ? updated : r)));
      onToast(`${updated.ticket} marked not approved. Confirmation sent automatically to ${updated.email}.`);
    } catch (err) {
      onToast(err instanceof ApiError ? err.message : "Couldn't reject that request.");
    }
  };

  const complete = async (id: number) => {
    if (!token) return;
    try {
      const updated = await staffComplete(token, id);
      setRequests((rs) => rs.map((r) => (r.id === id ? updated : r)));
      onToast(`${updated.ticket} marked complete. Confirmation sent automatically to ${updated.email}.`);
    } catch (err) {
      onToast(err instanceof ApiError ? err.message : "Couldn't mark that request complete.");
    }
  };

  return (
    <section className="px-5 md:px-10 py-16 max-w-4xl mx-auto">
      <Reveal>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
          <h2 className="font-display text-3xl">Staff dashboard</h2>
          <div className="flex items-center gap-2">
            {token && (
              <button
                onClick={() => setAccountOpen(true)}
                className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full border shrink-0 border-border-strong text-ink-faint"
              >
                <KeyRound size={12} /> Change password
              </button>
            )}
            <button
              onClick={() =>
                token
                  ? void staffLogout().then(() => {
                      setToken(null);
                      setMe(null);
                    })
                  : setPinOpen(true)
              }
              className={`text-[12px] font-medium px-3 py-1.5 rounded-full border shrink-0 transition-colors active:scale-[0.97] ${
                token ? "bg-teal text-white border-teal" : "border-border-strong text-ink-faint"
              }`}
            >
              {token ? "Staff mode on — sign out" : "Staff sign-in"}
            </button>
          </div>
        </div>
        <p className="mb-8 text-ink-muted">
          {token ? "Every request with full contact details, for approval." : "Sign in to review and approve incoming requests."}
        </p>
      </Reveal>

      {token && !loading && requests.length > 0 && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          {STAT_TILES.map(({ key, label, icon: Icon, className }) => (
            <motion.div
              key={key}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              className="rounded-lg border border-border bg-cream-card p-4"
            >
              <div className={`w-8 h-8 rounded-md flex items-center justify-center mb-3 ${className}`}>
                {key === "active" && stats.active > 0 ? (
                  <motion.span
                    className="flex"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  >
                    <Icon size={15} />
                  </motion.span>
                ) : (
                  <Icon size={15} />
                )}
              </div>
              <div className="font-display text-2xl leading-none mb-1">
                <AnimatedCounter value={stats[key]} />
              </div>
              <div className="text-[12px] text-ink-faint">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!token ? (
        <div className="rounded-xl border border-dashed p-10 text-center border-border-strong text-ink-faint">
          <ShieldAlert size={20} className="mx-auto mb-2" />
          Sign in as staff to see customer details and approve requests.
        </div>
      ) : loading ? (
        <div className="shimmer rounded-lg h-24 animate-shimmer" />
      ) : requests.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center border-border-strong text-ink-faint">
          No requests yet.
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r, i) => (
            <motion.div
              key={r.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 8) * 0.04, duration: 0.3 }}
              whileHover={{ y: -1, boxShadow: "0 4px 18px rgba(23,36,28,0.08)" }}
              className="rounded-lg border border-border p-4 bg-cream-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[11px] font-medium text-ink-faint">
                      {r.ticket} · {r.type}
                    </span>
                    <StatusPill status={r.status} fee={r.fee} />
                    <button
                      onClick={() => setViewing(r)}
                      className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full border border-border-strong text-ink-faint hover:text-ink hover:border-ink-faint transition-colors"
                    >
                      <Eye size={11} /> View
                    </button>
                  </div>
                  <div className="text-[14px]">{r.summary}</div>
                  {r.status === "rejected" && r.decisionNote && (
                    <div className="text-[12px] mt-1 text-[#8A3B22]">Note to customer: {r.decisionNote}</div>
                  )}
                  <div className="text-[12px] mt-1 flex flex-wrap gap-x-4 text-ink-faint">
                    <span>{r.name}</span>
                    <span>DOB {r.dob}</span>
                    <span className="flex items-center gap-1">
                      <Phone size={11} /> {r.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail size={11} /> {r.email}
                    </span>
                  </div>
                </div>
                {r.status === "received" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => approve(r.id)}
                      className="text-[13px] font-medium px-3 py-2 rounded-md bg-teal text-white active:scale-[0.97] transition-transform"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => reject(r.id)}
                      className="text-[13px] font-medium px-3 py-2 rounded-md border border-border-strong text-ink-soft active:scale-[0.97] transition-transform hover:border-[#8A3B22] hover:text-[#8A3B22]"
                    >
                      Reject
                    </button>
                  </div>
                )}
                {r.status === "approved" && r.fee != null && (
                  <span className="text-[12px] shrink-0 text-ink-faint">Awaiting customer payment</span>
                )}
                {((r.status === "approved" && r.fee == null) || r.status === "paid") && (
                  <button
                    onClick={() => complete(r.id)}
                    className="text-[13px] font-medium px-3 py-2 rounded-md shrink-0 bg-teal text-white active:scale-[0.97] transition-transform"
                  >
                    Mark complete
                  </button>
                )}
                {r.status === "completed" && (
                  <span className="flex items-center gap-1.5 text-[13px] shrink-0 text-[#2A6B2F]">
                    <CheckCircle2 size={15} /> Done
                  </span>
                )}
                {r.status === "rejected" && (
                  <span className="flex items-center gap-1.5 text-[13px] shrink-0 text-[#8A3B22]" title={r.decisionNote ?? undefined}>
                    <XCircle size={15} /> Not approved
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {token && me && (me.isAdmin || me.role === "executive") && <AdminPanel me={me} onToast={onToast} />}

      <AnimatePresence>
        {viewing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60"
            onClick={() => setViewing(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.2, 0.9, 0.3, 1.3] }}
              className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl p-6 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <div className="font-display text-lg">{viewing.ticket}</div>
                  <div className="text-[13px] text-ink-faint">{viewing.type}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusPill status={viewing.status} fee={viewing.fee} />
                  <button onClick={() => setViewing(null)} className="p-1.5 rounded-md text-ink-faint hover:text-ink">
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="text-[14px] mb-4 mt-3">{viewing.summary}</div>

              <div className="rounded-lg border border-border p-3.5 bg-cream-card mb-4">
                <div className="text-[11px] uppercase tracking-wide text-ink-faint mb-2">Customer</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13px]">
                  <div>
                    <span className="text-ink-faint">Name</span> {viewing.name}
                  </div>
                  <div>
                    <span className="text-ink-faint">DOB</span> {viewing.dob}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone size={11} className="text-ink-faint" /> {viewing.phone}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail size={11} className="text-ink-faint" /> {viewing.email}
                  </div>
                </div>
              </div>

              {Object.keys(viewing.details).length > 0 && (
                <div className="rounded-lg border border-border p-3.5 bg-cream-card mb-4">
                  <div className="text-[11px] uppercase tracking-wide text-ink-faint mb-2">Submitted details</div>
                  <div className="space-y-1.5 text-[13px]">
                    {Object.entries(viewing.details)
                      .filter(([, v]) => v !== null && v !== undefined && v !== "")
                      .map(([k, v]) => (
                        <div key={k} className="flex gap-2">
                          <span className="text-ink-faint shrink-0 capitalize">{k.replace(/_/g, " ")}:</span>
                          <span className="break-words">{String(v)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-border p-3.5 bg-cream-card">
                <div className="text-[11px] uppercase tracking-wide text-ink-faint mb-2">Timeline</div>
                <div className="space-y-1 text-[13px]">
                  <div>
                    <span className="text-ink-faint">Submitted</span> {new Date(viewing.createdAt).toLocaleString()}
                  </div>
                  {viewing.notifiedAt && (
                    <div>
                      <span className="text-ink-faint">Customer notified</span> {new Date(viewing.notifiedAt).toLocaleString()}
                    </div>
                  )}
                  {viewing.completedAt && (
                    <div>
                      <span className="text-ink-faint">Completed</span> {new Date(viewing.completedAt).toLocaleString()}
                    </div>
                  )}
                  {viewing.decisionNote && (
                    <div>
                      <span className="text-ink-faint">Note to customer</span> {viewing.decisionNote}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {accountOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60"
            onClick={() => setAccountOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.2, 0.9, 0.3, 1.3] }}
              className="w-full max-w-xs rounded-xl p-6 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-display text-lg mb-1">Change your password</div>
              <p className="text-[13px] mb-4 text-ink-faint">{me?.staffId}</p>
              <form onSubmit={handleChangePassword}>
                <input name="newPassword" type="password" required minLength={8} placeholder="New password" className={`${inputClass} mb-3`} />
                <input name="confirmPassword" type="password" required minLength={8} placeholder="Confirm new password" className={`${inputClass} mb-4`} />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-md font-medium text-[14px] bg-teal text-white active:scale-[0.97] transition-transform"
                >
                  Update password
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pinOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60"
            onClick={() => setPinOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.2, 0.9, 0.3, 1.3] }}
              className="w-full max-w-xs rounded-xl p-6 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-display text-lg mb-1">Staff sign-in</div>
              <p className="text-[13px] mb-4 text-ink-faint">
                Enter your Staff ID and password to review and approve cases.
              </p>
              {loginError && <div className="text-[13px] text-[#8A3B22] mb-3">{loginError}</div>}
              <form onSubmit={handleLogin}>
                <input name="staffId" type="text" autoFocus placeholder="Staff ID" className={`${inputClass} mb-3`} />
                <input name="password" type="password" placeholder="Password" className={`${inputClass} mb-4`} />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-md font-medium text-[14px] bg-teal text-white active:scale-[0.97] transition-transform"
                >
                  Sign in
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
