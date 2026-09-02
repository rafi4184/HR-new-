import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  CheckCircle2,
  Phone,
  Mail,
  XCircle,
  Sparkles,
  Ban,
  Check,
  Trash2,
  UserPlus,
  Users as UsersIcon,
  Crown,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { inputClass } from "./ui/Field";
import StatusPill from "./ui/StatusPill";
import Reveal from "./ui/Reveal";
import {
  ApiError,
  staffApprove,
  staffDeleteRequest,
  staffListRequests,
  staffLogin,
  staffReject,
  listUsers,
  createUser,
  deleteUser,
  type StaffUser,
} from "../lib/api";
import type { ServiceRequest } from "../types";

type RequestDecision =
  | { kind: "approve"; request: ServiceRequest }
  | { kind: "reject"; request: ServiceRequest }
  | { kind: "delete"; request: ServiceRequest }
  | null;

type UserAction =
  | { kind: "create" }
  | { kind: "delete"; user: StaffUser }
  | null;

export default function StaffDashboard({ onToast }: { onToast: (msg: string) => void }) {
  const [token, setToken] = useState<string | null>(null);
  const [me, setMe] = useState<StaffUser | null>(null);
  const [signInOpen, setSignInOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [tab, setTab] = useState<"queue" | "users">("queue");
  const [decision, setDecision] = useState<RequestDecision>(null);
  const [userAction, setUserAction] = useState<UserAction>(null);
  const [working, setWorking] = useState(false);

  const refresh = async (t: string, currentUser: StaffUser) => {
    setLoading(true);
    try {
      setRequests(await staffListRequests(t));
      if (currentUser.role === "admin") {
        setUsers(await listUsers(t));
      }
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
      const { token: t, user } = await staffLogin(data.username, data.password);
      setToken(t);
      setMe(user);
      setSignInOpen(false);
      onToast(`Welcome back, ${user.name || user.username}.`);
      refresh(t, user);
    } catch (err) {
      setLoginError(err instanceof ApiError ? err.message : "Sign-in failed.");
    }
    form.reset();
  };

  const signOut = () => {
    setToken(null);
    setMe(null);
    setRequests([]);
    setUsers([]);
    setTab("queue");
  };

  const runDecision = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!decision || !token) return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    setWorking(true);
    try {
      if (decision.kind === "approve") {
        const fee =
          decision.request.type === "Government Request"
            ? Number(String(data.fee || "").replace(/[^0-9]/g, "")) || 0
            : undefined;
        const updated = await staffApprove(token, decision.request.id, fee);
        setRequests((rs) => rs.map((r) => (r.id === updated.id ? updated : r)));
        onToast(`${updated.ticket} approved — approval email queued to ${updated.email}.`);
      } else if (decision.kind === "reject") {
        const updated = await staffReject(token, decision.request.id, (data.reason || "").trim());
        setRequests((rs) => rs.map((r) => (r.id === updated.id ? updated : r)));
        onToast(`${updated.ticket} closed — rejection email queued to ${updated.email}.`);
      } else if (decision.kind === "delete") {
        await staffDeleteRequest(token, decision.request.id);
        setRequests((rs) => rs.filter((r) => r.id !== decision.request.id));
        onToast(`${decision.request.ticket} removed from the ledger.`);
      }
      setDecision(null);
    } catch (err) {
      onToast(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setWorking(false);
    }
  };

  const runUserAction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userAction || !token) return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    setWorking(true);
    try {
      if (userAction.kind === "create") {
        const created = await createUser(token, {
          username: data.username.trim(),
          password: data.password,
          name: data.name.trim(),
          role: (data.role as "admin" | "staff") || "staff",
        });
        setUsers((us) => [...us, created]);
        onToast(`Added ${created.role} — ${created.username}.`);
      } else if (userAction.kind === "delete") {
        await deleteUser(token, userAction.user.id);
        setUsers((us) => us.filter((u) => u.id !== userAction.user.id));
        onToast(`${userAction.user.username} removed.`);
      }
      setUserAction(null);
    } catch (err) {
      onToast(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setWorking(false);
    }
  };

  const pending = requests.filter((r) => r.status === "received").length;
  const approved = requests.filter((r) => r.status === "approved").length;
  const paid = requests.filter((r) => r.status === "paid").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;

  const isAdmin = me?.role === "admin";

  return (
    <section id="dashboard" className="relative px-5 md:px-10 py-20 max-w-6xl mx-auto">
      <Reveal>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-gold mb-3">
              <Sparkles size={12} /> Case bureau
            </div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">Staff dashboard</h2>
            {me && (
              <p className="mt-2 text-[13px] text-ink-faint">
                Signed in as{" "}
                <span className="font-medium text-ink">
                  {me.name || me.username}
                </span>{" "}
                ·{" "}
                <span
                  className={`inline-flex items-center gap-1 font-mono uppercase text-[10px] tracking-[0.2em] px-2 py-0.5 rounded-full ${
                    isAdmin ? "bg-gold/10 text-gold" : "bg-teal-pale text-teal"
                  }`}
                >
                  {isAdmin ? <Crown size={10} /> : <ShieldCheck size={10} />}
                  {me.role}
                </span>
              </p>
            )}
          </div>
          {me ? (
            <button
              data-testid="staff-signout"
              onClick={signOut}
              className="flex items-center gap-1.5 text-[12px] font-medium px-4 py-2 rounded-full border border-border-strong text-ink-faint hover:text-ink transition-colors"
            >
              <LogOut size={12} /> Sign out
            </button>
          ) : (
            <button
              data-testid="staff-signin-toggle"
              onClick={() => setSignInOpen(true)}
              className="text-[12px] font-medium px-4 py-2 rounded-full border border-border-strong text-ink-faint hover:text-ink transition-colors"
            >
              Staff sign-in
            </button>
          )}
        </div>
        <p className="mb-8 text-ink-muted max-w-xl">
          {me
            ? "Approve, decline, or delete pending cases. Every decision emails the customer automatically."
            : "Sign in to review incoming cases and — when needed — manage the desk itself."}
        </p>
      </Reveal>

      {me && (
        <>
          {/* stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: "Pending", value: pending, tone: "text-[#8A6A12] bg-[#F4E7C9]" },
              { label: "Approved", value: approved, tone: "text-teal bg-teal-pale" },
              { label: "Settled", value: paid, tone: "text-[#2A6B2F] bg-[#DCEEDC]" },
              { label: "Declined", value: rejected, tone: "text-[#8A3B22] bg-[#F7E3DD]" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.5 }}
                data-testid={`stat-${s.label.toLowerCase()}`}
                className="rounded-xl border border-border p-4 bg-cream-card"
              >
                <div className="text-[11px] font-mono uppercase tracking-widest text-ink-faint">
                  {s.label}
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <div className="font-display text-3xl text-ink">{s.value}</div>
                  <div className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.tone}`}>
                    cases
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* admin tabs */}
          {isAdmin && (
            <div className="flex gap-2 mb-6 flex-wrap">
              {[
                { id: "queue" as const, label: "Case queue", icon: ShieldCheck },
                { id: "users" as const, label: "Users", icon: UsersIcon },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  data-testid={`dashboard-tab-${id}`}
                  className={`relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-md text-[13px] font-medium transition-colors ${
                    tab === id ? "text-white" : "bg-cream-panel text-ink-soft hover:text-ink"
                  }`}
                >
                  {tab === id && (
                    <motion.span
                      layoutId="dashTabIndicator"
                      className="absolute inset-0 bg-navy rounded-md"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon size={14} /> {label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {!me ? (
        <div className="rounded-xl border border-dashed p-10 text-center border-border-strong text-ink-faint">
          <ShieldAlert size={20} className="mx-auto mb-2" />
          Sign in as staff to see customer details and manage the desk.
        </div>
      ) : loading ? (
        <div className="shimmer rounded-lg h-24 animate-shimmer" />
      ) : tab === "queue" ? (
        requests.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center border-border-strong text-ink-faint">
            No requests yet.
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {requests.map((r) => (
                <motion.div
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.25 } }}
                  whileHover={{ y: -1, boxShadow: "0 8px 24px rgba(23,36,28,0.10)" }}
                  data-testid={`staff-request-${r.id}`}
                  className="rounded-xl border border-border p-4 bg-cream-card"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-ink-faint">
                          {r.ticket} · {r.type}
                        </span>
                        <StatusPill status={r.status} fee={r.fee} />
                      </div>
                      <div className="text-[15px] font-medium">{r.summary}</div>
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
                      {r.status === "rejected" && r.rejectionReason && (
                        <div className="mt-2 text-[12px] rounded-md px-3 py-2 bg-[#F7E3DD] text-[#8A3B22]">
                          <span className="font-medium">Desk note:</span> {r.rejectionReason}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      {r.status === "received" && (
                        <>
                          <button
                            onClick={() => setDecision({ kind: "approve", request: r })}
                            data-testid={`approve-btn-${r.id}`}
                            className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-md bg-teal text-white active:scale-[0.97] transition-transform hover:shadow-[0_8px_18px_rgba(47,93,63,0.35)]"
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            onClick={() => setDecision({ kind: "reject", request: r })}
                            data-testid={`reject-btn-${r.id}`}
                            className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-md border border-[#A6402A] text-[#A6402A] active:scale-[0.97] transition-colors hover:bg-[#A6402A] hover:text-white"
                          >
                            <Ban size={14} /> Reject
                          </button>
                          <button
                            onClick={() => setDecision({ kind: "delete", request: r })}
                            data-testid={`delete-btn-${r.id}`}
                            className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-md text-ink-soft hover:text-[#A6402A] transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                      {r.status === "approved" && r.fee != null && (
                        <span className="text-[12px] text-ink-faint">Awaiting customer payment</span>
                      )}
                      {r.status === "paid" && (
                        <span className="flex items-center gap-1.5 text-[13px] text-[#2A6B2F]">
                          <CheckCircle2 size={15} /> Settled
                        </span>
                      )}
                      {r.status === "rejected" && (
                        <span className="flex items-center gap-1.5 text-[13px] text-[#8A3B22]">
                          <XCircle size={15} /> Declined · emailed
                        </span>
                      )}
                      {isAdmin && r.status !== "received" && (
                        <button
                          onClick={() => setDecision({ kind: "delete", request: r })}
                          data-testid={`admin-delete-btn-${r.id}`}
                          className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-md text-ink-soft hover:text-[#A6402A] transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )
      ) : (
        // ---------- Admin: Users panel ----------
        <div>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="text-[13px] text-ink-muted">
              {users.length} account{users.length === 1 ? "" : "s"} on file.
            </div>
            <button
              onClick={() => setUserAction({ kind: "create" })}
              data-testid="add-user-btn"
              className="flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-md bg-navy text-white active:scale-[0.97] transition-transform hover:shadow-[0_10px_24px_rgba(23,36,28,0.25)]"
            >
              <UserPlus size={14} /> Add staff
            </button>
          </div>
          <div className="rounded-xl border border-border overflow-hidden bg-cream-card">
            <AnimatePresence initial={false}>
              {users.map((u, i) => (
                <motion.div
                  key={u.id}
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.04 * i }}
                  data-testid={`user-row-${u.username}`}
                  className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-navy text-white font-mono text-[13px]">
                    {u.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium truncate">{u.name || u.username}</div>
                    <div className="text-[11px] text-ink-faint font-mono truncate">
                      @{u.username}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 font-mono uppercase text-[10px] tracking-[0.18em] px-2 py-0.5 rounded-full ${
                      u.role === "admin" ? "bg-gold/10 text-gold" : "bg-teal-pale text-teal"
                    }`}
                  >
                    {u.role === "admin" ? <Crown size={10} /> : <ShieldCheck size={10} />}
                    {u.role}
                  </span>
                  {u.id === me?.id ? (
                    <span className="text-[11px] text-ink-faint w-14 text-right">you</span>
                  ) : (
                    <button
                      onClick={() => setUserAction({ kind: "delete", user: u })}
                      data-testid={`delete-user-${u.username}`}
                      className="text-ink-faint hover:text-[#A6402A] transition-colors p-2"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* --- Sign-in modal ------------------------------------------------ */}
      <AnimatePresence>
        {signInOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-sm"
            onClick={() => setSignInOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.2, 0.9, 0.3, 1.3] }}
              className="w-full max-w-sm rounded-2xl p-6 bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-display text-xl mb-1">Sign in</div>
              <p className="text-[13px] mb-4 text-ink-faint">
                Enter your staff credentials to reach the case queue.
              </p>
              {loginError && (
                <div className="text-[13px] text-[#8A3B22] mb-3">{loginError}</div>
              )}
              <form onSubmit={handleLogin}>
                <input
                  name="username"
                  autoFocus
                  placeholder="Username"
                  data-testid="staff-username"
                  className={`${inputClass} mb-3`}
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  data-testid="staff-password"
                  className={`${inputClass} mb-4`}
                />
                <button
                  type="submit"
                  data-testid="staff-signin-submit"
                  className="w-full py-2.5 rounded-md font-medium text-[14px] bg-teal text-white active:scale-[0.97] transition-transform"
                >
                  Sign in
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Request decision modal -------------------------------------- */}
      <AnimatePresence>
        {decision && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-sm"
            onClick={() => !working && setDecision(null)}
          >
            <motion.form
              onSubmit={runDecision}
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.2, 0.9, 0.3, 1.3] }}
              className="w-full max-w-md rounded-2xl p-6 bg-white shadow-2xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[11px] font-mono uppercase tracking-widest ${
                    decision.kind === "approve"
                      ? "text-teal"
                      : decision.kind === "reject"
                      ? "text-[#A6402A]"
                      : "text-ink-soft"
                  }`}
                >
                  {decision.kind === "approve"
                    ? "Approve case"
                    : decision.kind === "reject"
                    ? "Decline case"
                    : "Delete case"}
                </span>
              </div>
              <div className="font-display text-xl mb-1">{decision.request.ticket}</div>
              <p className="text-[13px] text-ink-faint mb-4">
                {decision.request.name} · {decision.request.summary}
              </p>

              {decision.kind === "approve" &&
                decision.request.type === "Government Request" && (
                  <label className="block mb-4">
                    <span className="text-[12px] font-medium text-ink-soft">Service fee (BDT)</span>
                    <input
                      name="fee"
                      defaultValue="3000"
                      inputMode="numeric"
                      data-testid="approve-fee-input"
                      className={`${inputClass} mt-1`}
                    />
                  </label>
                )}

              {decision.kind === "reject" && (
                <label className="block mb-4">
                  <span className="text-[12px] font-medium text-ink-soft">
                    Reason for the customer (they'll see this in the email)
                  </span>
                  <textarea
                    name="reason"
                    rows={4}
                    placeholder="e.g. We're fully booked for that arrival window. Try a nearby date."
                    data-testid="reject-reason-input"
                    className={`${inputClass} mt-1`}
                  />
                </label>
              )}

              {decision.kind === "delete" && (
                <div className="mb-4 rounded-md px-4 py-3 text-[13px] bg-[#F7E3DD] text-[#8A3B22]">
                  This removes the record permanently. The customer will <strong>not</strong> be
                  emailed.
                </div>
              )}

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDecision(null)}
                  disabled={working}
                  className="text-[13px] px-3 py-2 rounded-md text-ink-soft hover:text-ink transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={working}
                  data-testid={`${decision.kind}-confirm-btn`}
                  className={`flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-md text-white active:scale-[0.97] transition-transform disabled:opacity-60 ${
                    decision.kind === "approve"
                      ? "bg-teal hover:shadow-[0_10px_24px_rgba(47,93,63,0.35)]"
                      : "bg-[#A6402A] hover:shadow-[0_10px_24px_rgba(166,64,42,0.35)]"
                  }`}
                >
                  {decision.kind === "approve" ? (
                    <Check size={14} />
                  ) : decision.kind === "reject" ? (
                    <Ban size={14} />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  {working
                    ? "Working…"
                    : decision.kind === "approve"
                    ? "Approve & email"
                    : decision.kind === "reject"
                    ? "Decline & email"
                    : "Delete permanently"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Add / delete user modal ------------------------------------- */}
      <AnimatePresence>
        {userAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-sm"
            onClick={() => !working && setUserAction(null)}
          >
            <motion.form
              onSubmit={runUserAction}
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.2, 0.9, 0.3, 1.3] }}
              className="w-full max-w-md rounded-2xl p-6 bg-white shadow-2xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {userAction.kind === "create" ? (
                <>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-navy mb-1">
                    Invite staff
                  </div>
                  <div className="font-display text-xl mb-4">New desk account</div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <label className="block col-span-2">
                      <span className="text-[12px] font-medium text-ink-soft">Full name</span>
                      <input
                        name="name"
                        required
                        placeholder="e.g. Ayesha Rahman"
                        data-testid="new-user-name"
                        className={`${inputClass} mt-1`}
                      />
                    </label>
                    <label className="block">
                      <span className="text-[12px] font-medium text-ink-soft">Username</span>
                      <input
                        name="username"
                        required
                        placeholder="e.g. ayesha"
                        data-testid="new-user-username"
                        className={`${inputClass} mt-1`}
                      />
                    </label>
                    <label className="block">
                      <span className="text-[12px] font-medium text-ink-soft">Role</span>
                      <select
                        name="role"
                        defaultValue="staff"
                        data-testid="new-user-role"
                        className={`${inputClass} mt-1`}
                      >
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </label>
                    <label className="block col-span-2">
                      <span className="text-[12px] font-medium text-ink-soft">
                        Temporary password
                      </span>
                      <input
                        name="password"
                        type="text"
                        minLength={6}
                        required
                        placeholder="Min 6 characters"
                        data-testid="new-user-password"
                        className={`${inputClass} mt-1`}
                      />
                    </label>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setUserAction(null)}
                      disabled={working}
                      className="text-[13px] px-3 py-2 rounded-md text-ink-soft hover:text-ink transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={working}
                      data-testid="create-user-submit"
                      className="flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-md bg-teal text-white active:scale-[0.97] transition-transform disabled:opacity-60"
                    >
                      <UserPlus size={14} /> {working ? "Adding…" : "Add to desk"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-[#A6402A] mb-1">
                    Remove account
                  </div>
                  <div className="font-display text-xl mb-1">
                    Delete {userAction.user.username}?
                  </div>
                  <p className="text-[13px] text-ink-faint mb-4">
                    This account will lose access immediately. It doesn't affect any bookings on file.
                  </p>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setUserAction(null)}
                      disabled={working}
                      className="text-[13px] px-3 py-2 rounded-md text-ink-soft hover:text-ink transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={working}
                      data-testid="delete-user-confirm"
                      className="flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-md bg-[#A6402A] text-white active:scale-[0.97] transition-transform disabled:opacity-60"
                    >
                      <Trash2 size={14} /> {working ? "Removing…" : "Delete account"}
                    </button>
                  </div>
                </>
              )}
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
