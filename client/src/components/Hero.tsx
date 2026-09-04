import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import MagneticButton from "./ui/MagneticButton";
import { IMG_HERO_BG } from "../lib/constants";

const ease = [0.2, 0.8, 0.2, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section ref={ref} className="relative px-5 md:px-10 pt-14 pb-16 md:pt-20 md:pb-24 bg-paper-soft overflow-hidden">
      <motion.div
        aria-hidden="true"
        className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,151,59,0.22), transparent 70%)" }}
        animate={{ x: [0, 24, 0], y: [0, 16, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-32 -right-16 w-[480px] h-[480px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(15,37,64,0.1), transparent 70%)" }}
        animate={{ x: [0, -20, 0], y: [0, -14, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-5 text-[12px] tracking-[0.2em] uppercase text-gold-deep font-medium"
          >
            <span className="w-6 h-px bg-gold-deep" />
            Bangladesh · Trusted Service Partner
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="font-display text-navy text-[2.5rem] sm:text-[3.4rem] leading-[1.08] mb-6"
            style={{ textWrap: "balance" }}
          >
            Your Gateway to Trusted Services in Bangladesh
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="text-[16px] md:text-[18px] text-ink-muted leading-relaxed mb-9 max-w-xl"
          >
            From airport assistance and private transportation to government-request support,
            manpower, security, education and international careers — HR — The Mediator connects
            you with the services you need, coordinated by one trusted desk in Bangladesh.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            className="flex flex-wrap items-center gap-4"
          >
            <MagneticButton
              as="link"
              to="/#services"
              strength={0.3}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase bg-gradient-to-r from-gold to-[#E0B563] text-navy hover:from-gold-deep hover:to-gold-deep hover:text-white transition-colors"
            >
              Explore Services
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton
              as="link"
              to="/#request-service"
              strength={0.3}
              className="px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase border border-navy text-navy hover:bg-navy hover:text-white transition-colors"
            >
              Request a Service
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="relative"
        >
          <div className="rounded-2xl overflow-hidden shadow-card-hover aspect-[4/3]">
            <motion.img
              src={IMG_HERO_BG}
              alt="Bangladesh skyline"
              style={{ y: imgY }}
              className="w-full h-[125%] object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
