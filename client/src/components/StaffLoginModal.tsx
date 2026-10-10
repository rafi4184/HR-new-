import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { inputClass } from "./ui/Field";
import { staffLogin, ApiError } from "../lib/api";

// Shared staff sign-in popup — usable anywhere (the header, the staff
// dashboard) without first navigating to /staff. Callers own their own
// session state (this codebase has no global auth context — every
// component re-checks whoami() independently) and just get the token
// back on success to refresh themselves.
export default function StaffLoginModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    try {
      const { token } = await staffLogin(data.staffId, data.password);
      form.reset();
      onSuccess(token);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sign-in failed.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-navy/60"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.2, 0.9, 0.3, 1.3] }}
            className="w-full max-w-xs rounded-xl p-6 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-display text-lg mb-1">Staff sign-in</div>
            <p className="text-[13px] mb-4 text-ink-faint">Enter your Staff ID and password to continue.</p>
            {error && <div className="text-[13px] text-[#8A3B22] mb-3">{error}</div>}
            <form onSubmit={handleLogin}>
              <input name="staffId" type="text" autoFocus placeholder="Staff ID" className={`${inputClass} mb-3`} />
              <input name="password" type="password" placeholder="Password" className={`${inputClass} mb-4`} />
              <button
                type="submit"
                className="w-full py-2.5 rounded-md font-medium text-[14px] bg-navy text-white active:scale-[0.97] transition-transform"
              >
                Sign in
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
