import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import MagneticButton from "./ui/MagneticButton";
import type { BookingTab } from "../types";

export default function FinalCta({ onBook }: { onBook: (tab: BookingTab) => void }) {
  return (
    <section className="grain relative px-5 md:px-10 py-24 md:py-32 bg-navy text-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(60% 50% at 50% 40%, rgba(166,64,42,0.14), transparent)" }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative max-w-2xl mx-auto"
      >
        <h2 className="font-display text-white text-4xl md:text-5xl mb-5" style={{ textWrap: "balance" }}>
          One desk.
          <br />
          <span className="italic bg-gradient-to-br from-gold via-gold to-[#D9A441] bg-clip-text text-transparent">
            Everything handled.
          </span>
        </h2>
        <p className="text-mist text-[16px] max-w-md mx-auto mb-9">
          Tell us what you need and our team coordinates the details — the airport, the hotel,
          the government office, or the workforce behind your operation.
        </p>
        <MagneticButton
          onClick={() => onBook("airport")}
          strength={0.25}
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium text-[14px] tracking-wide uppercase bg-gold text-white active:scale-[0.97] hover:shadow-[0_14px_34px_rgba(166,64,42,0.4)] transition-shadow"
        >
          Speak With Our Desk
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </MagneticButton>
      </motion.div>
    </section>
  );
}
