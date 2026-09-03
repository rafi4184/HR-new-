import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Landmark, ChevronRight, Phone, MapPin } from "lucide-react";
import { BOARD_WORDS, IMG_HERO_BG, PURPOSES } from "../lib/constants";
import HeroFX from "./HeroFX";
import AmbientJourney from "./AmbientJourney";
import MagneticButton from "./ui/MagneticButton";
import { listContacts } from "../lib/api";
import type { BookingTab, Contact } from "../types";

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
  const [contacts, setContacts] = useState<Contact[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const iv = setInterval(() => setBoardIdx((i) => (i + 1) % BOARD_WORDS.length), 2200);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    listContacts()
      .then(setContacts)
      .catch(() => {});
  }, []);

  const phoneContact = contacts.find((c) => c.phone)?.phone;
  const addressContact = contacts.find((c) => c.address)?.address;

  const heroEase = [0.2, 0.8, 0.2, 1] as const;

  return (
    <section className="grain relative overflow-hidden px-5 md:px-10 pt-14 pb-16 md:pb-28 bg-navy">
      <motion.img
        src={IMG_HERO_BG}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-55"
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: [0.2, 0.8, 0.2, 1] }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, rgba(23,36,28,0.97) 20%, rgba(23,36,28,0.88) 45%, rgba(23,36,28,0.55) 75%, rgba(23,36,28,0.35) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(23,36,28,0.9), transparent 35%)" }}
      />
      <motion.div
        className="blob"
        style={{ width: 300, height: 300, bottom: -100, left: "2%", backgroundColor: "rgba(166,64,42,0.16)" }}
        animate={{ x: [0, -16, 0], y: [0, 14, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="blob"
        style={{ width: 220, height: 220, top: -60, right: "18%", backgroundColor: "rgba(212,175,80,0.14)" }}
        animate={{ x: [0, 18, 0], y: [0, -12, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <HeroFX />
      <AmbientJourney />

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
            shouldn&apos;t feel like{" "}
            <span className="bg-gradient-to-br from-gold via-gold to-[#D9A441] bg-clip-text text-transparent">
              paperwork.
            </span>
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
            className="flex flex-wrap gap-3 mb-8"
          >
            <MagneticButton
              onClick={() => onBook("airport")}
              strength={0.22}
              className="relative overflow-hidden flex items-center gap-2 px-5 py-3 rounded-md font-medium text-[15px] bg-gold text-white transition-shadow hover:shadow-[0_10px_26px_rgba(166,64,42,0.35)] active:scale-[0.97]"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Plane size={17} /> Book an airport pickup
              </span>
              <span className="absolute inset-0 overflow-hidden">
                <span className="absolute inset-y-0 left-0 w-1/3 bg-white/25 blur-md animate-shimmerSweep" />
              </span>
            </MagneticButton>
            <MagneticButton
              onClick={() => onBook("government")}
              strength={0.35}
              className="flex items-center gap-2 px-5 py-3 rounded-md font-medium text-[15px] border border-white/25 text-white active:scale-[0.97]"
            >
              <Landmark size={17} /> Start a government request
            </MagneticButton>
          </motion.div>

          {/* Floating cards — your real contact details (from the admin-
              editable contacts list), not fabricated stats. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.52, ease: heroEase }}
            className="flex flex-wrap gap-3"
          >
            {phoneContact && (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/[0.14] bg-white/[0.06] backdrop-blur-md"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-soft opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-soft" />
                </span>
                <Phone size={13} className="text-mist shrink-0" />
                <span className="text-[13px] text-white/85 font-medium">{phoneContact}</span>
              </motion.div>
            )}
            {addressContact && (
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/[0.14] bg-white/[0.06] backdrop-blur-md max-w-[280px]"
              >
                <MapPin size={13} className="text-gold shrink-0" />
                <span className="text-[13px] text-white/85 font-medium truncate">{addressContact}</span>
              </motion.div>
            )}
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
            className="rounded-xl overflow-hidden bg-cream-card border border-border"
            style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.35)", transformPerspective: 800 }}
            animate={{ rotateX: tilt.x, rotateY: tilt.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-dashed border-border-strong">
              <div>
                <div className="font-mono text-[10px] tracking-[0.2em] text-ink-faint uppercase mb-1">
                  Case file · Concierge desk
                </div>
                <div className="font-display italic text-xl text-ink">Meet &amp; Greet</div>
                <div className="text-[11px] mt-1 tracking-wide text-ink-faint">
                  Hazrat Shahjalal Int&apos;l · Dhaka
                </div>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-teal-tint shrink-0">
                <Plane size={18} color="#2F5D3F" />
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-y-4 gap-x-3 text-[13px]">
                <div>
                  <div className="text-ink-faint">Passenger</div>
                  <input
                    value={ticket.name}
                    onChange={(e) => setTicket((t) => ({ ...t, name: e.target.value }))}
                    placeholder="Guest of HR — The Mediator"
                    className="ticket-field font-medium w-full bg-transparent outline-none text-ink"
                  />
                </div>
                <div>
                  <div className="text-ink-faint">Flight</div>
                  <input
                    value={ticket.flight}
                    onChange={(e) => setTicket((t) => ({ ...t, flight: e.target.value }))}
                    placeholder="BG 147"
                    className="ticket-field font-medium w-full bg-transparent outline-none text-ink"
                  />
                </div>
                <div>
                  <div className="text-ink-faint">Purpose</div>
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
                  <div className="text-ink-faint">Onward</div>
                  <input
                    value={ticket.onward}
                    onChange={(e) => setTicket((t) => ({ ...t, onward: e.target.value }))}
                    placeholder="Bangladesh"
                    className="ticket-field font-medium w-full bg-transparent outline-none text-ink"
                  />
                </div>
              </div>
              <div className="mt-5 pt-4 flex items-center justify-between border-t border-border">
                <span className="text-[11px] font-mono uppercase tracking-wide text-ink-faint">
                  Fast-track · lounge · transfer
                </span>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded border-2 border-teal text-teal uppercase tracking-wide">
                  On file
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute -top-4 -right-4 w-[72px] h-[72px] rounded-full flex items-center justify-center border-[3px] border-gold text-gold bg-cream-card font-mono text-[10px] font-semibold uppercase tracking-wide leading-tight text-center select-none"
            initial={{ scale: 2.1, opacity: 0, rotate: -26 }}
            animate={{
              scale: 1,
              opacity: 1,
              rotate: -10,
              boxShadow: [
                "0 8px 18px rgba(23,36,28,0.18)",
                "0 8px 18px rgba(23,36,28,0.18), 0 0 0 6px rgba(166,64,42,0.12)",
                "0 8px 18px rgba(23,36,28,0.18)",
              ],
            }}
            transition={{
              scale: { delay: 0.9, duration: 0.55, ease: [0.2, 0.8, 0.2, 1.3] },
              opacity: { delay: 0.9, duration: 0.55 },
              rotate: { delay: 0.9, duration: 0.55, ease: [0.2, 0.8, 0.2, 1.3] },
              boxShadow: { delay: 1.6, duration: 2.4, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            Priority
            <br />
            case
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
