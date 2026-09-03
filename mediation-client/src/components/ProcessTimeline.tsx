import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FileSearch, MessagesSquare, Handshake, CheckCircle2 } from "lucide-react";
import { getLenis } from "../lib/smooth-scroll";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { icon: FileSearch, title: "Intake", body: "The dispute is logged, parties identified, and confidentiality terms set." },
  { icon: MessagesSquare, title: "Pre-Mediation", body: "Private 1-on-1 sessions surface each side's real interests, not just positions." },
  { icon: Handshake, title: "Joint Session", body: "A neutral, structured facilitation brings both parties to the table together." },
  { icon: CheckCircle2, title: "Resolution", body: "Terms are drafted, reviewed, and signed — with a clear record for compliance." },
];

export default function ProcessTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const lenis = getLenis();
    // Keep GSAP's ScrollTrigger in sync with Lenis's virtual scroll position
    // (without this, ScrollTrigger reads the native scrollTop, which Lenis
    // has already decoupled from what's visually on screen).
    const onLenisScroll = () => ScrollTrigger.update();
    lenis?.on("scroll", onLenisScroll);
    const tickerFn = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      if (!pathRef.current || !sectionRef.current) return;
      const length = pathRef.current.getTotalLength();
      gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });

      gsap.to(pathRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 0.6,
          onUpdate: (self) => {
            const step = Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length));
            setActiveStep(step);
          },
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      lenis?.off("scroll", onLenisScroll);
      gsap.ticker.remove(tickerFn);
    };
  }, []);

  return (
    <section id="process" ref={sectionRef} className="relative py-28 px-6 md:px-10 bg-obsidian-900">
      <div className="max-w-3xl mx-auto">
        <div className="text-[12px] uppercase tracking-[0.14em] text-gild mb-3 text-center">The process</div>
        <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-16">
          Four stages, one neutral path
        </h2>

        <div className="relative pl-10 md:pl-14">
          <svg className="absolute left-0 top-1 h-full w-8 md:w-10" viewBox="0 0 40 800" preserveAspectRatio="none" fill="none">
            <path d="M20 0 L20 800" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            <path ref={pathRef} d="M20 0 L20 800" stroke="#C9A24B" strokeWidth="2" />
          </svg>

          <div className="space-y-14">
            {STEPS.map((step, i) => {
              const active = i <= activeStep;
              return (
                <div key={step.title} className="relative">
                  <div
                    className={`absolute -left-10 md:-left-14 top-1 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border transition-colors duration-500 ${
                      active ? "bg-gild border-gild text-obsidian-950" : "bg-obsidian-800 border-white/15 text-white/40"
                    }`}
                  >
                    <step.icon size={16} />
                  </div>
                  <div
                    className={`transition-opacity duration-500 ${active ? "opacity-100" : "opacity-40"}`}
                  >
                    <div className="text-[11px] uppercase tracking-wide text-white/40 mb-1">Step {i + 1}</div>
                    <h3 className="font-display text-xl text-white mb-1.5">{step.title}</h3>
                    <p className="text-[14px] text-white/55 leading-relaxed max-w-md">{step.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
