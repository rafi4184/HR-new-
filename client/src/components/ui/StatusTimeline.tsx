import { motion } from "framer-motion";
import { Check } from "lucide-react";

export interface TimelineStage {
  key: string;
  label: string;
}

// Animated progress timeline for a real request status — every stage here
// maps directly to a value the `requests.status` column actually takes
// (see src/types.ts RequestStatus); nothing here is demo/mock data.
export default function StatusTimeline({
  stages,
  currentIndex,
}: {
  stages: TimelineStage[];
  currentIndex: number;
}) {
  const progress = stages.length > 1 ? currentIndex / (stages.length - 1) : 0;

  return (
    <div className="py-2">
      <div className="relative flex justify-between sm:hidden gap-4">
        <div className="absolute left-[13px] top-2 bottom-2 w-px bg-border" />
        <motion.div
          className="absolute left-[13px] top-2 w-px bg-navy origin-top"
          style={{ height: `${progress * 100}%` }}
          initial={{ height: 0 }}
          animate={{ height: `${progress * 100}%` }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        />
        <div className="flex flex-col gap-6 w-full">
          {stages.map((s, i) => (
            <Stage key={s.key} label={s.label} state={i < currentIndex ? "done" : i === currentIndex ? "active" : "upcoming"} vertical />
          ))}
        </div>
      </div>

      <div className="relative hidden sm:flex items-start">
        <div className="absolute left-0 right-0 top-[13px] h-px bg-border" />
        <motion.div
          className="absolute left-0 top-[13px] h-px bg-navy origin-left"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        />
        {stages.map((s, i) => (
          <div key={s.key} className="flex-1 flex flex-col items-center text-center">
            <Stage label={s.label} state={i < currentIndex ? "done" : i === currentIndex ? "active" : "upcoming"} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Stage({
  label,
  state,
  vertical = false,
}: {
  label: string;
  state: "done" | "active" | "upcoming";
  vertical?: boolean;
}) {
  const dot = (
    <div className="relative z-10 shrink-0">
      {state === "active" && (
        <motion.span
          className="absolute -inset-1.5 rounded-full bg-navy/25"
          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div
        className={`relative w-[26px] h-[26px] rounded-full flex items-center justify-center border-2 ${
          state === "done"
            ? "bg-navy border-navy"
            : state === "active"
              ? "bg-white border-navy"
              : "bg-white border-border"
        }`}
      >
        {state === "done" ? (
          <Check size={13} color="#fff" />
        ) : (
          <span className={`w-2 h-2 rounded-full ${state === "active" ? "bg-navy" : "bg-border-strong"}`} />
        )}
      </div>
    </div>
  );

  if (vertical) {
    return (
      <div className="flex items-center gap-3">
        {dot}
        <span className={`text-[13px] ${state === "upcoming" ? "text-ink-faint" : "text-ink"} ${state === "active" ? "font-medium" : ""}`}>
          {label}
        </span>
      </div>
    );
  }

  return (
    <>
      {dot}
      <span
        className={`mt-2 text-[12px] max-w-[100px] ${state === "upcoming" ? "text-ink-faint" : "text-ink"} ${
          state === "active" ? "font-medium" : ""
        }`}
      >
        {label}
      </span>
    </>
  );
}
