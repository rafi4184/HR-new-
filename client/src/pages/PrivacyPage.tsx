import { Link } from "react-router-dom";
import { useSeo } from "../lib/useSeo";

export default function PrivacyPage() {
  useSeo({
    title: "Privacy Policy | HR — The Mediator",
    description: "How HR — The Mediator collects, uses and protects the information you share with us.",
    path: "/privacy-policy",
  });

  return (
    <div className="px-5 md:px-10 py-16 max-w-3xl mx-auto">
      <h1 className="font-display text-3xl text-navy mb-6">Privacy Policy</h1>
      <div className="space-y-6 text-[14.5px] text-ink-soft leading-relaxed">
        <p>
          This Privacy Policy explains how HR — The Mediator ("we", "us") collects, uses and
          protects information when you use this website or request a service from us.
        </p>
        <section>
          <h2 className="font-display text-lg text-navy mb-2">Information We Collect</h2>
          <p>
            When you submit a service request or contact us, we collect the details you provide —
            such as your name, date of birth, phone/WhatsApp number, email address, and a
            description of the service you need.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg text-navy mb-2">How We Use Your Information</h2>
          <p>
            We use this information to process and coordinate the service you requested, contact
            you about your request, and keep an internal record for support and audit purposes. We
            do not sell your information to third parties.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg text-navy mb-2">Data Retention</h2>
          <p>
            Service request records are retained as part of our normal business and audit records.
            You can contact us at any time to ask about the information we hold about you.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg text-navy mb-2">Contact</h2>
          <p>
            For any privacy-related questions, please reach out via the contact details on our{" "}
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
