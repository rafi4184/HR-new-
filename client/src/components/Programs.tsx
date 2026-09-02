import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { GraduationCap, Radio, Globe2, ChevronRight } from "lucide-react";
import Reveal from "./ui/Reveal";
import { HASANUR_PHOTO, IMG_DUBAI, IMG_STUDENTS } from "../lib/constants";
import type { BookingTab } from "../types";

function ProgramCta({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <motion.button
      onClick={onClick}
      initial="rest"
      whileHover="hover"
      className="self-start flex items-center gap-2 px-5 py-2.5 rounded-md font-medium text-[14px] bg-gold text-white transition-shadow hover:shadow-[0_10px_26px_rgba(166,64,42,0.35)] active:scale-[0.97]"
    >
      {children}
      <motion.span
        className="flex"
        variants={{ rest: { x: 0 }, hover: { x: 4 } }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <ChevronRight size={15} />
      </motion.span>
    </motion.button>
  );
}

export default function Programs({
  onBook,
}: {
  onBook: (tab: BookingTab, program?: string) => void;
}) {
  const cardMotion = {
    whileHover: { y: -4, boxShadow: "0 20px 40px rgba(23,36,28,0.14)" },
    transition: { duration: 0.3 },
  };

  return (
    <section id="programs" className="grain relative px-5 md:px-10 py-16 bg-navy-light overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <h2 className="font-display text-3xl text-white mb-2" style={{ textWrap: "balance" }}>
            Programs &amp; career pathways
          </h2>
          <p className="max-w-lg mb-12 text-mist-soft">
            Beyond logistics — the training and placement work RURF and HR — The Mediator are
            known for on campus.
          </p>
        </Reveal>

        <div className="space-y-6">
          <Reveal>
            <motion.div
              {...cardMotion}
              className="rounded-2xl overflow-hidden grid md:grid-cols-[1fr_1.3fr] bg-navy-panel"
            >
              <img src={IMG_STUDENTS} alt="Graduates at a university" className="w-full h-56 md:h-full object-cover" />
              <div className="p-7 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3 text-gold">
                  <GraduationCap size={18} />
                  <span className="text-[13px] font-medium">Study Abroad Consultation</span>
                </div>
                <h3 className="font-display text-2xl text-white mb-2" style={{ textWrap: "balance" }}>
                  Get from application to visa without guessing.
                </h3>
                <p className="text-[14px] mb-5 text-mist-soft">
                  University shortlisting, statement of purpose review, scholarship guidance, and
                  visa-interview preparation for students heading to Singapore, Malaysia, Japan,
                  South Korea, China and beyond.
                </p>
                <ProgramCta onClick={() => onBook("programs", "study")}>Book a consultation</ProgramCta>
              </div>
            </motion.div>
          </Reveal>

          <Reveal>
            <motion.div
              {...cardMotion}
              className="rounded-2xl overflow-hidden grid md:grid-cols-[1fr_1.3fr] bg-navy-panel"
            >
              <div className="relative h-72 md:h-full">
                <img
                  src={HASANUR_PHOTO}
                  alt="Md. Hasanur Rahman, News Presenter"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-navy/90 to-transparent">
                  <div className="text-white text-[13px] font-medium">Md. Hasanur Rahman</div>
                  <div className="text-[11px] text-mist-faint">
                    News Presenter, BTV &amp; Radio Today · Lead Trainer
                  </div>
                </div>
              </div>
              <div className="p-7 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3 text-gold">
                  <Radio size={18} />
                  <span className="text-[13px] font-medium">Media &amp; Public Speaking Academy</span>
                </div>
                <h3 className="font-display text-2xl text-white mb-2" style={{ textWrap: "balance" }}>
                  Learn presentation from someone who does it on air.
                </h3>
                <p className="text-[14px] mb-4 text-mist-soft">
                  News &amp; event hosting, correct pronunciation, radio announcing, reporting,
                  language &amp; public speaking, and soft-skills development — taught by a
                  working national news presenter.
                </p>
                <div className="flex gap-4 mb-5 flex-wrap">
                  <div className="rounded-lg px-4 py-2.5 bg-navy-light border border-white/[0.08]">
                    <div className="text-[11px] text-teal-soft">Offline batch · 2 months, 16 classes</div>
                    <div className="text-white font-display text-lg">৳12,974</div>
                  </div>
                  <div className="rounded-lg px-4 py-2.5 bg-navy-light border border-white/[0.08]">
                    <div className="text-[11px] text-teal-soft">Online batch · Fri &amp; Sat, Zoom</div>
                    <div className="text-white font-display text-lg">৳5,874</div>
                  </div>
                </div>
                <ProgramCta onClick={() => onBook("programs", "media")}>Reserve a seat</ProgramCta>
              </div>
            </motion.div>
          </Reveal>

          <Reveal>
            <motion.div
              {...cardMotion}
              className="rounded-2xl overflow-hidden grid md:grid-cols-[1fr_1.3fr] bg-navy-panel"
            >
              <img src={IMG_DUBAI} alt="Gulf city skyline" className="w-full h-56 md:h-full object-cover" />
              <div className="p-7 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3 text-gold">
                  <Globe2 size={18} />
                  <span className="text-[13px] font-medium">Gulf &amp; Overseas Employment</span>
                </div>
                <h3 className="font-display text-2xl text-white mb-2" style={{ textWrap: "balance" }}>
                  Verified placement, not a broker&apos;s promise.
                </h3>
                <p className="text-[14px] mb-5 text-mist-soft">
                  Manpower export and recruitment support for the UAE, Qatar, Saudi Arabia, and
                  wider Gulf markets, drawing on our licensed staffing and outsourcing practice —
                  documentation, contracts, and pre-departure orientation included.
                </p>
                <ProgramCta onClick={() => onBook("programs", "gulf")}>Speak to the desk</ProgramCta>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
