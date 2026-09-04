import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { IMG_HERO_BG } from "../lib/constants";

const ease = [0.2, 0.8, 0.2, 1] as const;

export default function Hero() {
  return (
    <section className="relative px-5 md:px-10 pt-14 pb-16 md:pt-20 md:pb-24 bg-paper-soft overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
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
            Your Trusted Service &amp; Support Partner in Bangladesh
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="text-[16px] md:text-[18px] text-ink-muted leading-relaxed mb-9 max-w-xl"
          >
            HR — The Mediator connects individuals, families, businesses and international clients
            with trusted concierge, transport, government assistance, manpower, security, education
            and career services across Bangladesh.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              to="/#services"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase bg-gold text-navy hover:bg-gold-deep hover:text-white transition-colors"
            >
              Explore Our Services
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/#request-service"
              className="px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase border border-navy text-navy hover:bg-navy hover:text-white transition-colors"
            >
              Request a Service
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="relative"
        >
          <div className="rounded-2xl overflow-hidden shadow-card-hover aspect-[4/3]">
            <img src={IMG_HERO_BG} alt="Bangladesh skyline" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-card-hover px-5 py-4 hidden sm:block border border-border">
            <div className="text-navy font-display text-2xl leading-none">5</div>
            <div className="text-[12px] text-ink-faint mt-1">Core services, one desk</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
