import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function Toast({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 12, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 12, x: "-50%" }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-24 sm:bottom-5 left-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-full text-[13px] font-medium shadow-lg max-w-[90vw] bg-navy text-white"
        >
          <CheckCircle2 size={16} color="#5FA876" className="shrink-0" />
          <span className="truncate">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
