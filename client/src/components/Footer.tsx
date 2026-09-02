import { Phone, Mail, MapPin, Facebook, Instagram, Briefcase } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="px-5 md:px-10 pt-16 pb-10 bg-navy text-mist">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-10 mb-12">
        <div>
          <div className="font-display text-white text-xl mb-3">HR — The Mediator</div>
          <p className="text-[14px] leading-relaxed">
            Registered manpower, security &amp; consultancy company, Dhaka — running a concierge
            desk, a media training academy, and Gulf employment placement for Bangladesh&apos;s
            travellers, students and jobseekers.
          </p>
        </div>
        <div>
          <div className="text-white text-sm font-medium mb-3">Reach the desk</div>
          <div className="space-y-2 text-[14px]">
            <div className="flex items-center gap-2">
              <Phone size={14} /> 01682343364
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} /> 01717013150
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} /> hasanurrahman1986@gmail.com
            </div>
          </div>
        </div>
        <div>
          <div className="text-white text-sm font-medium mb-3">Find us</div>
          <div className="flex items-start gap-2 text-[14px] mb-4">
            <MapPin size={14} className="mt-0.5 shrink-0" />
            The Meditor, 4th floor, Green Chayera Manzil, Greater Road Mosque, Kadirganj, Rajshahi
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/hrmediator" target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://www.instagram.com/hr.themediator" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto pt-6 text-[12px] flex flex-col sm:flex-row justify-between gap-2 border-t border-white/10">
        <span>© {new Date().getFullYear()} HR — The Mediator Limited</span>
        <span className="flex items-center gap-1.5">
          <Briefcase size={13} /> A Rajshahi University Readers&apos; Forum affiliate
        </span>
      </div>
    </footer>
  );
}
