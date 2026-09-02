import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Landmark, ChevronRight } from "lucide-react";
import { BOARD_WORDS, IMG_HERO_BG, PURPOSES } from "../lib/constants";
import type { BookingTab } from "../types";

export interface HeroTicket {
  name: string;
  flight: string;
  purpose: string;
  onward: string;
}

export default function Hero({
  onBook,
  onUseDetails,
}: {
  onBook: (tab: BookingTab) => void;
  onUseDetails: (ticket: HeroTicket) => void;
}) {
  const [boardIdx, setBoardIdx] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [ticket, setTicket] = useState<HeroTicket>({
    name: "",
    flight: "",
    purpose: "Business",
    onward: "Bangladesh",
  });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const iv = setInterval(() => setBoardIdx((i) => (i + 1) % BOARD_WORDS.length), 2200);
    return () => clearInterval(iv);
  }, []);

  const heroEase = [0.2, 0.8, 0.2, 1] as const;

  return (
    <section className="relative overflow-hidden px-5 md:px-10 pt-14 pb-16 bg-navy">
      <img
        src={IMG_HERO_BG}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-55"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, rgba(11,27,46,0.97) 20%, rgba(11,27,46,0.88) 45%, rgba(11,27,46,0.55) 75%, rgba(11,27,46,0.35) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(11,27,46,0.9), transparent 35%)" }}
      />
      <motion.div
        className="blob"
        style={{ width: 300, height: 300, bottom: -100, left: "2%", backgroundColor: "rgba(201,162,39,0.16)" }}
        animate={{ x: [0, -16, 0], y: [0, 14, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: heroEase }}
            className="flex items-center gap-2 mb-5 text-[13px] text-teal-soft"
          >
            <span className="text-gold">Now serving</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={boardIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="font-medium tracking-wide text-white inline-block"
              >
                {BOARD_WORDS[boardIdx]}
              </motion.span>
            </AnimatePresence>
            <span>arrivals</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: heroEase }}
            className="font-display text-white text-[2.6rem] md:text-[3.4rem] leading-[1.05] mb-6"
            style={{ textWrap: "balance" }}
          >
            Landing in Bangladesh
            <br />
            shouldn&apos;t feel like paperwork.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: heroEase }}
            className="text-[17px] max-w-md mb-8 text-mist"
          >
            HR — The Mediator meets you at the gate, arranges the hotel and the car, trains your
            next career move, and carries your government errands so you don&apos;t have to queue
            for them yourself.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42, ease: heroEase }}
            className="flex flex-wrap gap-3"
          >
            <button
              onClick={() => onBook("airport")}
              className="flex items-center gap-2 px-5 py-3 rounded-md font-medium text-[15px] bg-gold text-navy transition-all hover:shadow-[0_10px_26px_rgba(201,162,39,0.35)] hover:-translate-y-px active:scale-[0.97]"
            >
              <Plane size={17} /> Book an airport pickup
            </button>
            <button
              onClick={() => onBook("government")}
              className="flex items-center gap-2 px-5 py-3 rounded-md font-medium text-[15px] border border-white/25 text-white active:scale-[0.97] transition-transform"
            >
              <Landmark size={17} /> Start a government request
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: heroEase }}
          className="relative mx-auto w-full max-w-sm"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            setTilt({ x: py * -6, y: px * 8 });
          }}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        >
          <motion.div
            ref={cardRef}
            className="rounded-2xl overflow-hidden bg-cream"
            style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.35)", transformPerspective: 800 }}
            animate={{ rotateX: tilt.x, rotateY: tilt.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          >
            <div className="p-6 bg-gradient-to-br from-teal to-teal-bright">
              <div className="flex items-center justify-between text-white">
                <span className="font-display text-xl">Meet &amp; Greet</span>
                <Plane size={22} />
              </div>
              <div className="text-[11px] mt-1 tracking-wide text-[#D8ECE7]">
                Hazrat Shahjalal Int&apos;l · Dhaka
              </div>
            </div>
            <div
              className="relative px-6 py-5"
              style={{
                backgroundImage: "radial-gradient(circle, #0B1B2E 4px, transparent 4px)",
                backgroundSize: "16px 8px",
                backgroundRepeat: "repeat-x",
                backgroundPosition: "top",
              }}
            >
              <div className="border-t border-dashed border-[#C7BFAB] -mt-0.5" />
              <div className="grid grid-cols-2 gap-y-4 gap-x-3 mt-5 text-[13px]">
                <div>
                  <div className="text-[#8B7F63]">Passenger</div>
                  <input
                    value={ticket.name}
                    onChange={(e) => setTicket((t) => ({ ...t, name: e.target.value }))}
                    placeholder="Guest of HR — The Mediator"
                    className="ticket-field font-medium w-full bg-transparent outline-none text-ink"
                  />
                </div>
                <div>
                  <div className="text-[#8B7F63]">Flight</div>
                  <input
                    value={ticket.flight}
                    onChange={(e) => setTicket((t) => ({ ...t, flight: e.target.value }))}
                    placeholder="BG 147"
                    className="ticket-field font-medium w-full bg-transparent outline-none text-ink"
                  />
                </div>
                <div>
                  <div className="text-[#8B7F63]">Purpose</div>
                  <select
                    value={ticket.purpose}
                    onChange={(e) => setTicket((t) => ({ ...t, purpose: e.target.value }))}
                    className="ticket-field font-medium w-full bg-transparent outline-none text-ink"
                  >
                    {PURPOSES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="text-[#8B7F63]">Onward</div>
                  <input
                    value={ticket.onward}
                    onChange={(e) => setTicket((t) => ({ ...t, onward: e.target.value }))}
                    placeholder="Bangladesh"
                    className="ticket-field font-medium w-full bg-transparent outline-none text-ink"
                  />
                </div>
              </div>
              <div className="mt-5 pt-4 flex items-center justify-between border-t border-[#E1DACB]">
                <span className="text-[11px] text-[#8B7F63]">Fast-track · lounge · transfer</span>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-teal-pale text-teal">
                  CONFIRMED
                </span>
              </div>
            </div>
          </motion.div>
          <button
            onClick={() => onUseDetails(ticket)}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-[13px] font-medium bg-white/[0.08] text-white border border-white/[0.18] active:scale-[0.97] transition-transform hover:bg-white/[0.14]"
          >
            Use these details to book <ChevronRight size={14} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
