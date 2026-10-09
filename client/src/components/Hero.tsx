import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, PlaneTakeoff, Landmark, GraduationCap, ShieldCheck, Plane } from "lucide-react";
import MagneticButton from "./ui/MagneticButton";
import { IMG_HERO_BG } from "../lib/constants";
import { useDict, useLanguage } from "../lib/i18n";
import { hero, heroOrbit } from "../lib/translations";
import { useSiteText } from "../lib/siteContent";

const ease = [0.2, 0.8, 0.2, 1] as const;

const ORBIT_ICONS = [
  { Icon: PlaneTakeoff, style: { top: "-8%", left: "-6%" }, delay: 0, to: "/airport-vip", labelKey: "airport" as const, primary: true },
  { Icon: Landmark, style: { top: "8%", right: "-8%" }, delay: 0.9, to: "/government-request", labelKey: "government" as const, primary: false },
  { Icon: ShieldCheck, style: { bottom: "10%", left: "-9%" }, delay: 1.8, to: "/manpower-security", labelKey: "manpower" as const, primary: false },
  { Icon: GraduationCap, style: { bottom: "-7%", right: "-5%" }, delay: 2.7, to: "/courses-careers", labelKey: "courses" as const, primary: false },
];

// Flight path the plane icon travels along, from the curb (bottom-left)
// up to the Terminal 3 spotlight badge (top-right) — drawn once, then the
// plane loops along it continuously.
const FLIGHT_PATH = "M14,86 C 30,70 40,55 58,42 C 72,32 82,24 90,14";

export default function Hero() {
  const T = useDict(hero);
  const { lang } = useLanguage();
  const eyebrow = useSiteText("hero.eyebrow");
  const h1 = useSiteText("hero.h1");
  const paragraph = useSiteText("hero.paragraph");
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section ref={ref} className="relative px-5 md:px-10 pt-14 pb-16 md:pt-20 md:pb-24 bg-white overflow-hidden">
      <motion.div
        aria-hidden="true"
        className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(198,161,91,0.10), transparent 70%)" }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-32 -right-16 w-[480px] h-[480px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(16,42,67,0.06), transparent 70%)" }}
        animate={{ x: [0, -24, 0], y: [0, -16, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 w-[300px] h-[300px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(198,161,91,0.06), transparent 70%)" }}
        animate={{ x: [0, 18, 0], y: [0, -22, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-5 text-[12px] tracking-[0.2em] uppercase text-gold-deep font-medium"
          >
            <span className="w-6 h-px bg-gold-deep" />
            {eyebrow}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="font-display text-navy text-[2.5rem] sm:text-[3.4rem] leading-[1.08] mb-6"
            style={{ textWrap: "balance" }}
          >
            {h1}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="text-[16px] md:text-[18px] text-ink-muted leading-relaxed mb-9 max-w-xl"
          >
            {paragraph}
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
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase bg-gold text-white hover:bg-gold-deep transition-colors"
            >
              {T.exploreServices}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton
              as="link"
              to="/#request-service"
              strength={0.3}
              className="px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase border border-navy text-navy hover:bg-navy hover:text-white transition-colors"
            >
              {T.requestService}
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="relative mx-4 sm:mx-8 lg:mx-2"
        >
          <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-gold/40 via-transparent to-navy/20 blur-md pointer-events-none" />
          <div className="relative rounded-2xl overflow-hidden shadow-card-hover aspect-[4/3] border border-white/60">
            <motion.img
              src={IMG_HERO_BG}
              alt="Hazrat Shahjalal International Airport, Dhaka — Terminal 3"
              style={{ y: imgY }}
              className="w-full h-[125%] object-cover"
            />
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/25"
              animate={{ opacity: [0.2, 0.45, 0.2] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Flight path: a plane glides from the curb up to the Terminal 3
                spotlight badge, looping continuously — ties the visual to the
                airport VIP flagship story without relying on a stock photo. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              <motion.path
                d={FLIGHT_PATH}
                fill="none"
                stroke="white"
                strokeWidth="0.6"
                strokeDasharray="2 2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{ duration: 1.1, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              />
            </svg>
            <motion.div
              aria-hidden="true"
              className="absolute text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0 }}
              animate={{
                left: ["14%", "30%", "40%", "58%", "72%", "82%", "90%"],
                top: ["86%", "70%", "55%", "42%", "32%", "24%", "14%"],
                rotate: -42,
                opacity: [0, 1, 1, 1, 1, 1, 0],
              }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 1.3 }}
            >
              <Plane size={16} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.0, ease: [0.2, 0.9, 0.3, 1.3] }}
              className="absolute top-3 right-3 max-w-[180px] rounded-xl bg-white/90 backdrop-blur-sm border border-white/70 shadow-card px-3 py-2.5"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-deep" />
                </span>
                <span className="text-[9.5px] font-medium tracking-[0.12em] uppercase text-gold-deep">
                  {T.spotlightTag}
                </span>
              </div>
              <div className="text-[13px] font-display text-navy leading-snug">{T.spotlightTitle}</div>
            </motion.div>
          </div>

          {ORBIT_ICONS.map(({ Icon, style, delay, to, labelKey, primary }, i) => (
            <motion.div
              key={i}
              className="hidden sm:block absolute"
              style={style}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay }}
            >
              {primary && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-xl bg-gold/40"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <Link
                to={to}
                aria-label={heroOrbit[labelKey][lang]}
                title={heroOrbit[labelKey][lang]}
                className={
                  primary
                    ? "relative flex w-14 h-14 rounded-xl bg-gradient-to-br from-gold to-navy text-white shadow-card-hover items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                    : "relative flex w-12 h-12 rounded-xl bg-white shadow-card-hover items-center justify-center text-gold-deep border border-border hover:bg-gold hover:text-navy hover:scale-110 transition-all cursor-pointer"
                }
              >
                <Icon size={primary ? 22 : 20} />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="relative mt-10 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <a
          href="/#services"
          aria-label={heroOrbit.scrollCue[lang]}
          title={heroOrbit.scrollCue[lang]}
          className="text-ink-faint hover:text-gold-deep transition-colors cursor-pointer"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown size={20} />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
