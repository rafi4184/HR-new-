import { useEffect, useState, type FormEvent } from "react";
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
  KeyRound,
  Activity,
  Search,
  X,
  ListChecks,
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
  listAuditLog,
  changePassword,
  fetchStats,
  bulkApprove,
  bulkReject,
  type AuditEntry,
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
  const [tab, setTab] = useState<"queue" | "users" | "audit">("queue");
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [auditFilter, setAuditFilter] = useState<{
    action: "all" | AuditEntry["action"];
    actor: string;
    range: "24h" | "7d" | "30d" | "all";
  }>({ action: "all", actor: "", range: "all" });
  const [livePending, setLivePending] = useState<number | null>(null);
  const [selfChangeOpen, setSelfChangeOpen] = useState(false);
  const [selfChangeError, setSelfChangeError] = useState<string | null>(null);
  const [mustReset, setMustReset] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkMode, setBulkMode] = useState<"approve" | "reject" | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [decision, setDecision] = useState<RequestDecision>(null);
  const [userAction, setUserAction] = useState<UserAction>(null);
  const [working, setWorking] = useState(false);

  const refresh = async (t: string, currentUser: StaffUser) => {
    setLoading(true);
    try {
      setRequests(await staffListRequests(t));
      if (currentUser.role === "admin") {
        const [u, a] = await Promise.all([listUsers(t), listAuditLog(t)]);
        setUsers(u);
        setAudit(a);
      }
    } finally {
      setLoading(false);
    }
  };

  // Live pending-count + queue polling every 15s while signed in
  useEffect(() => {
    if (!token || !me) {
      setLivePending(null);
      return;
    }
    let alive = true;
    const tick = async () => {
      try {
        const [s, r] = await Promise.all([
          fetchStats(token),
          staffListRequests(token),
        ]);
        if (!alive) return;
        setLivePending(s.pending);
        setRequests((prev) => {
          // Only update if server state actually changed (compact hash)
          const key = (arr: typeof r) =>
            arr.map((x) => `${x.id}:${x.status}:${x.updatedAt}`).join("|");
          return key(prev) === key(r) ? prev : r;
        });
      } catch {
        // ignore transient errors
      }
    };
    tick();
    const iv = setInterval(tick, 15000);
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, [token, me]);

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
      if (user.mustResetPassword) {
        setMustReset(true);
      } else {
        refresh(t, user);
      }
    } catch (err) {
      setLoginError(err instanceof ApiError ? err.message : "Sign-in failed.");
    }
    form.reset();
  };

  const runPasswordReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    setResetError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (data.new_password !== data.confirm_password) {
      setResetError("New password and confirmation don't match.");
      return;
    }
    setWorking(true);
    try {
      const { user } = await changePassword(token, data.current_password, data.new_password);
      setMe(user);
      setMustReset(false);
      onToast("Password updated. Welcome to the desk.");
      refresh(token, user);
    } catch (err) {
      setResetError(err instanceof ApiError ? err.message : "Couldn't update password.");
    } finally {
      setWorking(false);
    }
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
          email: (data.email || "").trim() || undefined,
          send_invite_email: data.send_invite === "on",
        });
        setUsers((us) => [...us, created]);
        const suffix = (created as { inviteSent?: boolean }).inviteSent
          ? " (invite email queued)."
          : ".";
        onToast(`Added ${created.role} — ${created.username}${suffix}`);
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

  const runSelfChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    setSelfChangeError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (data.new_password !== data.confirm_password) {
      setSelfChangeError("New password and confirmation don't match.");
      return;
    }
    setWorking(true);
    try {
      const { user } = await changePassword(token, data.current_password, data.new_password);
      setMe(user);
      setSelfChangeOpen(false);
      onToast("Password updated.");
    } catch (err) {
      setSelfChangeError(err instanceof ApiError ? err.message : "Couldn't update password.");
    } finally {
      setWorking(false);
    }
  };

  const filteredAudit = audit.filter((e) => {
    if (auditFilter.action !== "all" && e.action !== auditFilter.action) return false;
    if (
      auditFilter.actor &&
      !(e.actorUsername || "").toLowerCase().includes(auditFilter.actor.toLowerCase())
    )
      return false;
    if (auditFilter.range !== "all") {
      const cutoff = Date.now() - {
        "24h": 24 * 3600e3,
        "7d": 7 * 24 * 3600e3,
        "30d": 30 * 24 * 3600e3,
      }[auditFilter.range];
      if (new Date(e.at).getTime() < cutoff) return false;
    }
    return true;
  });

  const filteredRequests = requests.filter((r) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      r.ticket.toLowerCase().includes(q) ||
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.toLowerCase().includes(q) ||
      r.summary.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q)
    );
  });

  const selectableIds = filteredRequests.filter((r) => r.status === "received").map((r) => r.id);
  const allSelected =
    selectableIds.length > 0 && selectableIds.every((id) => selected.has(id));

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const runBulk = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !bulkMode || selected.size === 0) return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    setWorking(true);
    try {
      const ids = Array.from(selected);
      if (bulkMode === "approve") {
        const fee = data.fee ? Number(String(data.fee).replace(/[^0-9]/g, "")) : undefined;
        const { approved, skipped } = await bulkApprove(token, ids, fee);
        setRequests((rs) =>
          rs.map((r) => approved.find((a) => a.id === r.id) || r)
        );
        onToast(
          `${approved.length} approved · ${skipped.length} skipped. Emails queued.`
        );
      } else {
        const reason = (data.reason || "").trim();
        const { rejected, skipped } = await bulkReject(token, ids, reason);
        setRequests((rs) =>
          rs.map((r) => rejected.find((a) => a.id === r.id) || r)
        );
        onToast(
          `${rejected.length} declined · ${skipped.length} skipped. Emails queued.`
        );
      }
      clearSelection();
      setBulkMode(null);
    } catch (err) {
      onToast(err instanceof ApiError ? err.message : "Bulk action failed.");
    } finally {
      setWorking(false);
    }
  };

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
            <div className="flex items-center gap-2 shrink-0">
              {livePending !== null && livePending > 0 && (
                <motion.span
                  key={livePending}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  data-testid="live-pending-badge"
                  className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-[#F4E7C9] text-[#8A6A12]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A6A12] animate-pulse" />
                  {livePending} pending
                </motion.span>
              )}
              <button
                data-testid="self-change-password"
                onClick={() => setSelfChangeOpen(true)}
                className="hidden sm:flex items-center gap-1.5 text-[12px] font-medium px-3 py-2 rounded-full border border-border-strong text-ink-faint hover:text-ink transition-colors"
              >
                <KeyRound size={12} /> Password
              </button>
              <button
                data-testid="staff-signout"
                onClick={signOut}
                className="flex items-center gap-1.5 text-[12px] font-medium px-4 py-2 rounded-full border border-border-strong text-ink-faint hover:text-ink transition-colors"
              >
                <LogOut size={12} /> Sign out
              </button>
            </div>
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
                { id: "audit" as const, label: "Audit log", icon: Activity },
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
            {/* Search + bulk toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <label className="relative flex-1 min-w-[220px]">
                <Search
                  size={14}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-ink-faint pointer-events-none"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by ticket, guest, email, phone…"
                  data-testid="queue-search"
                  className="w-full text-[13px] pl-9 pr-9 py-2 rounded-full border border-border-strong bg-white outline-none focus:border-teal transition-colors"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-faint hover:text-ink"
                  >
                    <X size={14} />
                  </button>
                )}
              </label>
              {selectableIds.length > 0 && (
                <button
                  onClick={() =>
                    allSelected ? clearSelection() : setSelected(new Set(selectableIds))
                  }
                  data-testid="select-all-btn"
                  className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-2 rounded-full border border-border-strong text-ink-faint hover:text-ink transition-colors"
                >
                  <ListChecks size={13} />
                  {allSelected ? "Clear selection" : "Select all pending"}
                </button>
              )}
            </div>

            {/* Bulk action bar */}
            <AnimatePresence>
              {selected.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.25 }}
                  data-testid="bulk-toolbar"
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-teal bg-teal-pale px-4 py-3"
                >
                  <span className="text-[13px] font-medium text-teal">
                    {selected.size} selected
                  </span>
                  <span className="flex-1" />
                  <button
                    onClick={() => setBulkMode("approve")}
                    data-testid="bulk-approve-btn"
                    className="flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-md bg-teal text-white active:scale-[0.97] transition-transform hover:shadow-[0_8px_18px_rgba(47,93,63,0.35)]"
                  >
                    <Check size={14} /> Approve all
                  </button>
                  <button
                    onClick={() => setBulkMode("reject")}
                    data-testid="bulk-reject-btn"
                    className="flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-md border border-[#A6402A] text-[#A6402A] active:scale-[0.97] hover:bg-[#A6402A] hover:text-white transition-colors"
                  >
                    <Ban size={14} /> Decline all
                  </button>
                  <button
                    onClick={clearSelection}
                    className="text-[12px] font-medium text-ink-faint hover:text-ink transition-colors"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {filteredRequests.length === 0 ? (
              <div className="rounded-xl border border-dashed p-10 text-center border-border-strong text-ink-faint">
                No cases match "{query}".
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {filteredRequests.map((r) => (
                <motion.div
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.25 } }}
                  whileHover={{ y: -1, boxShadow: "0 8px 24px rgba(23,36,28,0.10)" }}
                  data-testid={`staff-request-${r.id}`}
                  className={`rounded-xl border p-4 transition-colors ${
                    selected.has(r.id)
                      ? "border-teal bg-teal-pale/40"
                      : "border-border bg-cream-card"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    {r.status === "received" && (
                      <label className="flex items-center pt-1 sm:pt-0 shrink-0 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selected.has(r.id)}
                          onChange={() => toggleSelect(r.id)}
                          data-testid={`select-${r.id}`}
                          className="w-4 h-4 accent-teal cursor-pointer"
                        />
                      </label>
                    )}
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
            )}
          </div>
        )
      ) : tab === "users" ? (
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
                    <div className="text-[11px] text-ink-faint font-mono truncate flex items-center gap-2">
                      <span>@{u.username}</span>
                      {u.email && (
                        <span className="flex items-center gap-1 text-ink-faint">
                          <Mail size={10} /> {u.email}
                        </span>
                      )}
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
      ) : (
        // ---------- Admin: Audit log ----------
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-ink-faint mr-1">
              Filter
            </div>
            {(["all", "approve", "reject", "delete_request", "create_user", "delete_user", "password_reset"] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAuditFilter((f) => ({ ...f, action: a }))}
                data-testid={`audit-filter-${a}`}
                className={`text-[11px] font-mono uppercase tracking-[0.16em] px-2.5 py-1 rounded-full border transition-colors ${
                  auditFilter.action === a
                    ? "bg-navy text-white border-navy"
                    : "border-border-strong text-ink-faint hover:text-ink"
                }`}
              >
                {a === "all" ? "all" : a.replace(/_/g, " ")}
              </button>
            ))}
            <span className="w-px h-4 bg-border mx-1" />
            {(["24h", "7d", "30d", "all"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setAuditFilter((f) => ({ ...f, range: r }))}
                data-testid={`audit-range-${r}`}
                className={`text-[11px] font-mono uppercase tracking-[0.16em] px-2.5 py-1 rounded-full border transition-colors ${
                  auditFilter.range === r
                    ? "bg-teal text-white border-teal"
                    : "border-border-strong text-ink-faint hover:text-ink"
                }`}
              >
                {r === "all" ? "all time" : r}
              </button>
            ))}
            <input
              value={auditFilter.actor}
              onChange={(e) => setAuditFilter((f) => ({ ...f, actor: e.target.value }))}
              placeholder="Filter by actor…"
              data-testid="audit-actor-filter"
              className="text-[12px] px-3 py-1.5 rounded-full border border-border-strong bg-white outline-none focus:border-teal min-w-[160px]"
            />
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-cream-card">
            {filteredAudit.length === 0 ? (
              <div className="p-10 text-center text-ink-faint text-[13px]">
                {audit.length === 0
                  ? "No activity recorded yet."
                  : "No entries match those filters."}
              </div>
            ) : (
              <div>
                {filteredAudit.map((e, i) => {
                  const tone =
                    e.action === "approve"
                      ? "bg-teal-pale text-teal"
                      : e.action === "reject"
                      ? "bg-[#F7E3DD] text-[#8A3B22]"
                      : e.action === "delete_request" || e.action === "delete_user"
                      ? "bg-[#F4E7C9] text-[#8A6A12]"
                      : e.action === "create_user"
                      ? "bg-[#DCEEDC] text-[#2A6B2F]"
                      : "bg-cream-panel text-ink-soft";
                  const label = e.action.replace(/_/g, " ");
                  const when = new Date(e.at);
                  return (
                    <motion.div
                      key={e.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(0.02 * i, 0.4) }}
                      data-testid={`audit-${e.id}`}
                      className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0"
                    >
                      <span
                        className={`shrink-0 text-[10px] font-mono uppercase tracking-[0.18em] px-2 py-1 rounded-full ${tone}`}
                      >
                        {label}
                      </span>
                      <div className="flex-1 min-w-0 text-[13px]">
                        <span className="font-medium text-ink">{e.actorUsername || "system"}</span>
                        <span className="text-ink-faint">
                          {" "}
                          {e.actorRole ? `(${e.actorRole})` : ""} ·{" "}
                        </span>
                        <span className="text-ink">{e.targetLabel || e.targetType || "—"}</span>
                        {e.meta && Object.keys(e.meta).length > 0 && (
                          <span className="text-ink-faint text-[12px] ml-2">
                            {Object.entries(e.meta)
                              .filter(([, v]) => v !== null && v !== undefined && v !== "")
                              .map(([k, v]) => `${k}: ${String(v)}`)
                              .join(" · ")}
                          </span>
                        )}
                      </div>
                      <div className="shrink-0 text-[11px] font-mono text-ink-faint">
                        {when.toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
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
                    <label className="block col-span-2">
                      <span className="text-[12px] font-medium text-ink-soft">
                        Email (used for invite &amp; — for admins — the weekly digest)
                      </span>
                      <input
                        name="email"
                        type="email"
                        placeholder="e.g. ayesha@thedesk.com"
                        data-testid="new-user-email"
                        className={`${inputClass} mt-1`}
                      />
                    </label>
                    <label className="col-span-2 flex items-start gap-2 text-[13px] text-ink-soft cursor-pointer">
                      <input
                        name="send_invite"
                        type="checkbox"
                        defaultChecked
                        data-testid="new-user-invite-check"
                        className="mt-0.5 accent-teal"
                      />
                      <span>
                        Email the temporary password to this address so they can sign in.
                      </span>
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
      {/* --- Forced password reset (first-time sign in) ------------------ */}
      <AnimatePresence>
        {mustReset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy/85 backdrop-blur-md"
          >
            <motion.form
              onSubmit={runPasswordReset}
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.2, 0.9, 0.3, 1.3] }}
              className="w-full max-w-md rounded-2xl p-7 bg-white shadow-2xl border border-border relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-16 w-56 h-56 rounded-full bg-teal/20 blur-3xl" />
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-teal-pale flex items-center justify-center mb-3">
                  <KeyRound size={18} className="text-teal" />
                </div>
                <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-teal mb-1">
                  First sign-in
                </div>
                <div className="font-display text-2xl mb-1">Set your own password</div>
                <p className="text-[13px] text-ink-faint mb-4 leading-relaxed">
                  For safety, please replace the temporary password your admin set for you before
                  reaching the case queue.
                </p>
                {resetError && (
                  <div className="text-[13px] rounded-md px-3 py-2 mb-3 bg-[#F7E3DD] text-[#8A3B22]">
                    {resetError}
                  </div>
                )}
                <input
                  name="current_password"
                  type="password"
                  required
                  placeholder="Temporary password"
                  data-testid="reset-current-password"
                  className={`${inputClass} mb-3`}
                />
                <input
                  name="new_password"
                  type="password"
                  required
                  minLength={8}
                  placeholder="New password (min 8 chars)"
                  data-testid="reset-new-password"
                  className={`${inputClass} mb-3`}
                />
                <input
                  name="confirm_password"
                  type="password"
                  required
                  placeholder="Confirm new password"
                  data-testid="reset-confirm-password"
                  className={`${inputClass} mb-4`}
                />
                <button
                  type="submit"
                  disabled={working}
                  data-testid="reset-submit"
                  className="w-full py-2.5 rounded-md font-medium text-[14px] bg-teal text-white active:scale-[0.97] transition-transform disabled:opacity-60"
                >
                  {working ? "Updating…" : "Set password & continue"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setToken(null);
                    setMe(null);
                    setMustReset(false);
                  }}
                  className="w-full mt-2 py-2 text-[12px] text-ink-faint hover:text-ink transition-colors"
                >
                  Sign out instead
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
      {/* --- Bulk action modal ------------------------------------------ */}
      <AnimatePresence>
        {bulkMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-sm"
            onClick={() => !working && setBulkMode(null)}
          >
            <motion.form
              onSubmit={runBulk}
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.2, 0.9, 0.3, 1.3] }}
              className="w-full max-w-md rounded-2xl p-6 bg-white shadow-2xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`text-[11px] font-mono uppercase tracking-widest mb-1 ${
                  bulkMode === "approve" ? "text-teal" : "text-[#A6402A]"
                }`}
              >
                Bulk {bulkMode}
              </div>
              <div className="font-display text-xl mb-1">
                {bulkMode === "approve" ? "Approve " : "Decline "}
                {selected.size} case{selected.size === 1 ? "" : "s"}?
              </div>
              <p className="text-[13px] text-ink-faint mb-4">
                Each customer will receive an individual{" "}
                {bulkMode === "approve" ? "approval" : "rejection"} email. Non-pending items are
                skipped automatically.
              </p>

              {bulkMode === "approve" && (
                <label className="block mb-4">
                  <span className="text-[12px] font-medium text-ink-soft">
                    Shared fee for any government cases (BDT — optional)
                  </span>
                  <input
                    name="fee"
                    defaultValue=""
                    inputMode="numeric"
                    placeholder="Leave blank for no fee"
                    data-testid="bulk-fee-input"
                    className={`${inputClass} mt-1`}
                  />
                </label>
              )}

              {bulkMode === "reject" && (
                <label className="block mb-4">
                  <span className="text-[12px] font-medium text-ink-soft">
                    Shared reason (goes into every email)
                  </span>
                  <textarea
                    name="reason"
                    rows={4}
                    required
                    placeholder="e.g. We're fully booked for that arrival window."
                    data-testid="bulk-reason-input"
                    className={`${inputClass} mt-1`}
                  />
                </label>
              )}

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBulkMode(null)}
                  disabled={working}
                  className="text-[13px] px-3 py-2 rounded-md text-ink-soft hover:text-ink transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={working}
                  data-testid={`bulk-${bulkMode}-confirm`}
                  className={`flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-md text-white active:scale-[0.97] transition-transform disabled:opacity-60 ${
                    bulkMode === "approve"
                      ? "bg-teal hover:shadow-[0_10px_24px_rgba(47,93,63,0.35)]"
                      : "bg-[#A6402A] hover:shadow-[0_10px_24px_rgba(166,64,42,0.35)]"
                  }`}
                >
                  {bulkMode === "approve" ? <Check size={14} /> : <Ban size={14} />}
                  {working
                    ? "Processing…"
                    : bulkMode === "approve"
                    ? "Approve all & email"
                    : "Decline all & email"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Self-service change password ------------------------------- */}
      <AnimatePresence>
        {selfChangeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-sm"
            onClick={() => !working && setSelfChangeOpen(false)}
          >
            <motion.form
              onSubmit={runSelfChange}
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.2, 0.9, 0.3, 1.3] }}
              className="w-full max-w-md rounded-2xl p-6 bg-white shadow-2xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[11px] font-mono uppercase tracking-widest text-teal mb-1">
                Change password
              </div>
              <div className="font-display text-xl mb-4">Update your own password</div>
              {selfChangeError && (
                <div className="text-[13px] rounded-md px-3 py-2 mb-3 bg-[#F7E3DD] text-[#8A3B22]">
                  {selfChangeError}
                </div>
              )}
              <input
                name="current_password"
                type="password"
                required
                placeholder="Current password"
                data-testid="self-current-password"
                className={`${inputClass} mb-3`}
              />
              <input
                name="new_password"
                type="password"
                required
                minLength={8}
                placeholder="New password (min 8 chars)"
                data-testid="self-new-password"
                className={`${inputClass} mb-3`}
              />
              <input
                name="confirm_password"
                type="password"
                required
                placeholder="Confirm new password"
                data-testid="self-confirm-password"
                className={`${inputClass} mb-4`}
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelfChangeOpen(false)}
                  disabled={working}
                  className="text-[13px] px-3 py-2 rounded-md text-ink-soft hover:text-ink transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={working}
                  data-testid="self-change-submit"
                  className="flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-md bg-teal text-white active:scale-[0.97] transition-transform disabled:opacity-60"
                >
                  <KeyRound size={14} /> {working ? "Updating…" : "Save"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
