import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, CheckCircle2, Phone, Mail } from "lucide-react";
import { inputClass } from "./ui/Field";
import StatusPill from "./ui/StatusPill";
import Reveal from "./ui/Reveal";
import { staffApprove, staffListRequests, staffLogin, ApiError } from "../lib/api";
import type { ServiceRequest } from "../types";

export default function StaffDashboard({ onToast }: { onToast: (msg: string) => void }) {
  const [token, setToken] = useState<string | null>(null);
  const [pinOpen, setPinOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

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
      const { token: t } = await staffLogin(data.username, data.password);
      setToken(t);
      setPinOpen(false);
      onToast("Staff mode enabled.");
      refresh(t);
    } catch (err) {
      setLoginError(err instanceof ApiError ? err.message : "Sign-in failed.");
    }
    form.reset();
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
      onToast(`${updated.ticket} approved. Confirmation email simulated to ${updated.email}.`);
    } catch (err) {
      onToast(err instanceof ApiError ? err.message : "Couldn't approve that request.");
    }
  };

  return (
    <section className="px-5 md:px-10 py-16 max-w-4xl mx-auto">
      <Reveal>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
          <h2 className="font-display text-3xl">Staff dashboard</h2>
          <button
            onClick={() => (token ? setToken(null) : setPinOpen(true))}
            className={`text-[12px] font-medium px-3 py-1.5 rounded-full border shrink-0 transition-colors active:scale-[0.97] ${
              token ? "bg-teal text-white border-teal" : "border-border-strong text-ink-faint"
            }`}
          >
            {token ? "Staff mode on — sign out" : "Staff sign-in"}
          </button>
        </div>
        <p className="mb-8 text-ink-muted">
          {token ? "Every request with full contact details, for approval." : "Sign in to review and approve incoming requests."}
        </p>
      </Reveal>

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
          {requests.map((r) => (
            <motion.div
              key={r.id}
              layout
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
                  </div>
                  <div className="text-[14px]">{r.summary}</div>
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
                  <button
                    onClick={() => approve(r.id)}
                    className="text-[13px] font-medium px-3 py-2 rounded-md shrink-0 bg-teal text-white active:scale-[0.97] transition-transform"
                  >
                    Approve &amp; email
                  </button>
                )}
                {r.status === "approved" && r.fee != null && (
                  <span className="text-[12px] shrink-0 text-ink-faint">Awaiting customer payment</span>
                )}
                {r.status === "paid" && (
                  <span className="flex items-center gap-1.5 text-[13px] shrink-0 text-[#2A6B2F]">
                    <CheckCircle2 size={15} /> Settled
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
                Enter the desk username and password to review and approve cases.
              </p>
              {loginError && <div className="text-[13px] text-[#8A3B22] mb-3">{loginError}</div>}
              <form onSubmit={handleLogin}>
                <input name="username" autoFocus placeholder="Username" className={`${inputClass} mb-3`} />
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
