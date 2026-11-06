import { Link } from "react-router-dom";
import { useSeo } from "../lib/useSeo";

export default function TermsPage() {
  useSeo({
    title: "Terms & Conditions | HR — The Mediator",
    description: "The terms and conditions for using the HR — The Mediator website and requesting our services.",
    path: "/terms",
  });

  return (
    <div className="px-5 md:px-10 py-16 max-w-3xl mx-auto">
      <h1 className="font-display text-3xl text-navy mb-6">Terms &amp; Conditions</h1>
      <div className="space-y-6 text-[14.5px] text-ink-soft leading-relaxed">
        <p>
          These terms govern your use of this website and any service you request from HR — The
          Mediator. By submitting a service request, you agree to these terms.
        </p>
        <section>
          <h2 className="font-display text-lg text-navy mb-2">Our Services</h2>
          <p>
            We coordinate airport VIP reception, hotel &amp; car booking, government-request
            assistance, manpower &amp; security, and courses &amp; careers support. Each service
            request is reviewed individually, and scope, fees and timelines are confirmed with you
            directly before work begins.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg text-navy mb-2">Accuracy of Information</h2>
          <p>
            You agree to provide accurate information when submitting a service request. Delays or
            errors caused by inaccurate information provided to us are not our responsibility.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg text-navy mb-2">Government &amp; Third-Party Processes</h2>
          <p>
            Some services depend on external government offices, airlines, hotels or third-party
            providers. We coordinate on your behalf but cannot guarantee outcomes controlled by
            those third parties.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg text-navy mb-2">Payments</h2>
          <p>
            Where a service fee applies, it is confirmed with you before payment is requested.
            Payment methods currently supported are shown at checkout.
          </p>
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
