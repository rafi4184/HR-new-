import { motion } from "framer-motion";
import { Building2, UserCheck, Users2 } from "lucide-react";
import Card3D from "./Card3D";

const PILLARS = [
  {
    icon: Building2,
    title: "Employer Representation",
    body: "HR and legal counsel are briefed and represented throughout, with a case record that stands up to scrutiny.",
  },
  {
    icon: UserCheck,
    title: "1-on-1 Intake",
    body: "Every party is heard privately first. Statements stay confidential to the mediator unless a party consents otherwise.",
  },
  {
    icon: Users2,
    title: "Joint Facilitation",
    body: "A structured joint session, led by a neutral mediator, moves both sides from position to resolution.",
  },
];

export default function MediationPillars() {
  return (
    <section id="pillars" className="relative py-28 px-6 md:px-10 bg-obsidian-950">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mb-14"
        >
          <div className="text-[12px] uppercase tracking-[0.14em] text-gild mb-3">How we work</div>
          <h2 className="font-display text-3xl md:text-4xl text-white">Three pillars of a neutral process</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Card3D className="p-7 h-full">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-gild/10 border border-gild/20">
                  <p.icon size={20} className="text-gild" />
                </div>
                <h3 className="font-display text-xl text-white mb-2.5">{p.title}</h3>
                <p className="text-[14px] text-white/55 leading-relaxed">{p.body}</p>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
