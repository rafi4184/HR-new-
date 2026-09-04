import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSeo } from "../lib/useSeo";
import Reveal from "../components/ui/Reveal";
import { HASANUR_PHOTO } from "../lib/constants";

export default function AboutPage() {
  useSeo({
    title: "About Us | HR — The Mediator",
    description:
      "HR — The Mediator is a registered manpower, security and consultancy company based in Bangladesh, running a concierge desk, media training academy and Gulf employment placement.",
    path: "/about-us",
  });

  return (
    <div>
      <section className="px-5 md:px-10 py-14 md:py-20 bg-paper-soft text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">About Us</div>
          <h1 className="font-display text-3xl md:text-5xl text-navy mb-5">A Trusted Service Partner in Bangladesh</h1>
          <p className="text-[16px] text-ink-muted leading-relaxed">
            HR — The Mediator is a registered manpower, security and consultancy company running a
            concierge desk, a media training academy, and Gulf employment placement for
            Bangladesh&apos;s travellers, students and jobseekers.
          </p>
        </div>
      </section>

      <section className="px-5 md:px-10 py-14 max-w-4xl mx-auto grid md:grid-cols-[1fr_1.4fr] gap-10 items-center">
        <Reveal>
          <div className="rounded-2xl overflow-hidden shadow-card-hover">
            <img src={HASANUR_PHOTO} alt="Md. Hasanur Rahman, News Presenter" className="w-full h-full object-cover" />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display text-2xl text-navy mb-3">Md. Hasanur Rahman</h2>
          <p className="text-[13px] text-gold-deep font-medium mb-4 uppercase tracking-wide">
            News Presenter, BTV &amp; Radio Today · Lead Trainer
          </p>
          <p className="text-[14.5px] text-ink-muted leading-relaxed mb-4">
            HR — The Mediator was built to give travellers, families, businesses and jobseekers one
            trusted point of contact in Bangladesh — instead of chasing separate agents for the
            airport, the hotel, the government office, the security desk and the training academy.
          </p>
          <p className="text-[14.5px] text-ink-muted leading-relaxed">
            The company is a proud Rajshahi University Readers&apos; Forum affiliate, drawing on a
            licensed staffing and consultancy practice built over years of government and corporate
            contracts.
          </p>
        </Reveal>
      </section>

      <section className="px-5 md:px-10 py-14 bg-paper-panel text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-navy mb-4">Explore Our Services</h2>
          <p className="text-ink-muted mb-8">
            Airport VIP, hotel &amp; car, government requests, manpower &amp; security, and courses &amp; careers.
          </p>
          <Link
            to="/#services"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase bg-gradient-to-r from-gold to-[#E0B563] text-navy hover:from-gold-deep hover:to-gold-deep hover:text-white transition-colors"
          >
            View All Services
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
