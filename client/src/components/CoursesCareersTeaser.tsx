import { Link } from "react-router-dom";
import { ArrowRight, Radio, Globe2 } from "lucide-react";
import Reveal from "./ui/Reveal";
import { IMG_STUDENTS, IMG_DUBAI } from "../lib/constants";

export default function CoursesCareersTeaser() {
  return (
    <section className="px-5 md:px-10 py-16 md:py-20 bg-paper-panel">
      <div className="max-w-7xl mx-auto">
        <Reveal className="max-w-2xl mb-12">
          <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">
            Courses &amp; Careers
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-navy mb-3" style={{ textWrap: "balance" }}>
            Two career tracks, one team behind you
          </h2>
          <p className="text-ink-muted">
            Professional training and international placement support — not just media training.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          <Reveal>
            <Link
              to="/media-public-speaking"
              className="group flex flex-col h-full rounded-2xl overflow-hidden border border-border bg-white shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={IMG_STUDENTS}
                  alt="Media and public speaking training"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-7">
                <div className="flex items-center gap-2 mb-3 text-gold-deep">
                  <Radio size={17} />
                  <span className="text-[13px] font-medium uppercase tracking-wide">Track One</span>
                </div>
                <h3 className="font-display text-xl text-navy mb-2">Media &amp; Public Speaking Academy</h3>
                <p className="text-[14px] text-ink-muted leading-relaxed mb-5">
                  Public speaking, communication, presentation skills, media skills and professional
                  confidence — taught by a working national news presenter.
                </p>
                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-deep group-hover:gap-2.5 transition-all">
                  Explore Academy <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={0.08}>
            <Link
              to="/study-work-gulf"
              className="group flex flex-col h-full rounded-2xl overflow-hidden border border-border bg-white shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={IMG_DUBAI}
                  alt="Gulf city skyline"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-7">
                <div className="flex items-center gap-2 mb-3 text-gold-deep">
                  <Globe2 size={17} />
                  <span className="text-[13px] font-medium uppercase tracking-wide">Track Two</span>
                </div>
                <h3 className="font-display text-xl text-navy mb-2">International Careers — Study &amp; Work in the Gulf</h3>
                <p className="text-[14px] text-ink-muted leading-relaxed mb-5">
                  Overseas university admission, study-abroad guidance, Gulf employment opportunities,
                  career placement, and visa/pre-departure support.
                </p>
                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-deep group-hover:gap-2.5 transition-all">
                  Explore International Careers <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
