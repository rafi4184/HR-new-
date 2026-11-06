import { Link } from "react-router-dom";
import { useSeo } from "../lib/useSeo";

export default function TermsPage() {
  useSeo({
    title: "Terms & Conditions | ARK Property Solution",
    description: "The terms and conditions for using the ARK Property Solution website and services.",
    path: "/terms",
  });

  return (
    <div className="px-5 md:px-10 py-16 max-w-3xl mx-auto">
      <h1 className="font-display text-3xl text-navy mb-6">Terms &amp; Conditions</h1>
      <div className="space-y-6 text-[14.5px] text-ink-soft leading-relaxed">
        <p>
          These terms govern your use of this website and any service you request from ARK
          Property Solution. By submitting an enquiry, you agree to these terms.
        </p>
        <section>
          <h2 className="font-display text-lg text-navy mb-2">Our Services</h2>
          <p>
            We provide real estate sales, property management and buyer's agency services across
            Sydney and NSW. Each enquiry is reviewed individually, and scope, fees and timelines
            are confirmed with you directly before any paid engagement begins.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg text-navy mb-2">Accuracy of Information</h2>
          <p>
            You agree to provide accurate information when submitting an enquiry. Delays or errors
            caused by inaccurate information provided to us are not our responsibility.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg text-navy mb-2">Third-Party Processes</h2>
          <p>
            Some services depend on external parties — buyers, sellers, tenants, tradespeople,
            conveyancers, or government bodies. We coordinate on your behalf but cannot guarantee
            outcomes controlled by those third parties.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg text-navy mb-2">Fees</h2>
          <p>Where a service fee applies, it is discussed and agreed with you directly before any paid engagement begins.</p>
        </section>
        <section>
          <h2 className="font-display text-lg text-navy mb-2">Contact</h2>
          <p>
            For questions about these terms, please reach out via our{" "}
            <Link to="/contact" className="text-gold-deep underline">
              Contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
