import type { BookingTab } from "../types";

export interface Faq {
  question: string;
  answer: string;
}

export interface ServicePageData {
  id: string;
  path: string;
  navLabel: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  whoFor: string[];
  included: string[];
  process: { title: string; body: string }[];
  faqs: Faq[];
  cta: string;
  bookTab: BookingTab | null;
  related: string[];
}

export const HOME_FAQS: Faq[] = [
  {
    question: "What does ARK Property Solution do?",
    answer:
      "We're a Sydney-based real estate agency covering three services: real estate sales (appraisals, marketing and negotiation for sellers), property management (end-to-end rental management for landlords), and buyer's agency (independent representation for buyers and investors).",
  },
  {
    question: "Which areas do you cover?",
    answer:
      "We're based in Sydney and primarily serve clients across New South Wales. Get in touch with your suburb or area and we'll confirm whether it's within our current coverage.",
  },
  {
    question: "I want to sell my property — what's the first step?",
    answer:
      "Submit a sales enquiry with your property address and a little about your timeframe. We'll follow up to arrange an appraisal and walk you through our marketing and sale process.",
  },
  {
    question: "I'm a landlord — can you manage my rental property?",
    answer:
      "Yes. Our property management service covers tenant placement, rent collection, routine inspections and maintenance coordination. Submit a property management enquiry and we'll talk through onboarding.",
  },
  {
    question: "What is a buyer's agent, and do I need one?",
    answer:
      "A buyer's agent represents you, the buyer or investor — not the seller. We research the market, shortlist properties, handle due diligence and negotiate on your behalf.",
  },
  {
    question: "Is there a fee to enquire?",
    answer:
      "No — submitting an enquiry through our website is free. Any service fees are discussed and agreed with you directly before any paid engagement begins.",
  },
  {
    question: "How do I get in touch?",
    answer:
      "Use the Get in Touch button on any page, choose the service that fits, and share your contact details. Our team will follow up directly.",
  },
];

export const SERVICE_PAGES: Record<string, ServicePageData> = {
  "property-sales": {
    id: "property-sales",
    path: "/property-sales",
    navLabel: "Sell / Appraisal",
    title: "Real Estate Sales",
    metaTitle: "Sell Your Property in Sydney | Real Estate Sales & Appraisals | ARK Property Solution",
    metaDescription:
      "Thinking of selling in Sydney? ARK Property Solution handles appraisals, marketing and negotiation from first enquiry to settlement, with honest advice on price and timing.",
    h1: "Sell Your Property in Sydney",
    intro:
      "From a straightforward appraisal to a full marketing campaign and negotiation, we handle the sale of your property with one team from first enquiry through to settlement — honest advice on price and timing included.",
    whoFor: [
      "Homeowners ready to sell or exploring their options",
      "Investors looking to exit a property",
      "Executors and families selling an inherited property",
      "Anyone who wants a straight answer on what their property is worth",
    ],
    included: [
      "A property appraisal grounded in current local sales data",
      "A marketing plan matched to your property and timeline",
      "Professional photography and listing coordination",
      "Open home and private inspection management",
      "Offer negotiation and sale process management through to settlement",
    ],
    process: [
      { title: "Tell us about your property", body: "Address, property type and your timeframe — takes a minute to submit." },
      { title: "We arrange your appraisal", body: "A straight assessment of likely sale price based on current local market data." },
      { title: "We market and show the property", body: "Photography, listing and open homes or private inspections, coordinated for you." },
      { title: "Negotiation through to settlement", body: "We handle offers and negotiation, keeping you updated at every step." },
    ],
    faqs: [
      {
        question: "How much is my property worth?",
        answer:
          "Submit a sales enquiry with your property address and we'll arrange an appraisal based on current local sales data and the specifics of your property.",
      },
      {
        question: "Is there a cost to get an appraisal?",
        answer: "No — an initial appraisal and consultation is free. Any fees for a full sale campaign are agreed with you upfront before you commit.",
      },
      {
        question: "How long does a typical sale take?",
        answer:
          "It depends on the property, price point and current market conditions — we'll give you a realistic estimate once we understand your property and goals.",
      },
    ],
    cta: "Get a Property Appraisal",
    bookTab: "sales",
    related: ["property-management", "buyers-agency"],
  },

  "property-management": {
    id: "property-management",
    path: "/property-management",
    navLabel: "Property Management",
    title: "Property Management",
    metaTitle: "Sydney Property Management for Landlords | ARK Property Solution",
    metaDescription:
      "End-to-end rental property management in Sydney: tenant placement, rent collection, inspections and maintenance coordination — one team handling your rental property.",
    h1: "Property Management for Sydney Landlords",
    intro:
      "Tenant placement, rent collection, routine inspections and maintenance coordination — handled by one team so you're not fielding tenant calls and tradespeople yourself.",
    whoFor: [
      "Landlords with an existing tenanted property",
      "New investors who've just settled on a rental property",
      "Landlords unhappy with their current managing agent",
      "Owners relocating or living overseas who need local, hands-on management",
    ],
    included: [
      "Tenant screening and placement",
      "Rent collection and arrears follow-up",
      "Routine property inspections with reporting",
      "Maintenance coordination with vetted tradespeople",
      "Lease renewals and end-of-tenancy management",
    ],
    process: [
      { title: "Tell us about your property", body: "Address, property type and current status — vacant, tenanted, or newly purchased." },
      { title: "We review and onboard", body: "Our team walks you through management terms and gets your property set up." },
      { title: "We handle the day to day", body: "Tenant placement or ongoing management, rent collection and inspections." },
      { title: "Regular reporting", body: "You get clear updates — you're never left wondering what's happening with your property." },
    ],
    faqs: [
      {
        question: "What does property management cost?",
        answer: "Management fees are discussed and agreed with you directly based on your property, before any management agreement begins.",
      },
      {
        question: "Can you take over management of an already-tenanted property?",
        answer: "Yes — we regularly take over management from another agent or from self-managing landlords, with a smooth handover for existing tenancies.",
      },
      {
        question: "How often will I hear from you?",
        answer: "You'll get regular updates on inspections, rent and any maintenance issues — not just a call when something goes wrong.",
      },
    ],
    cta: "Get a Property Management Quote",
    bookTab: "management",
    related: ["property-sales", "buyers-agency"],
  },

  "buyers-agency": {
    id: "buyers-agency",
    path: "/buyers-agency",
    navLabel: "Buyer's Agency",
    title: "Buyer's Agency",
    metaTitle: "Sydney Buyer's Agent | Independent Property Search & Negotiation | ARK Property Solution",
    metaDescription:
      "ARK Property Solution's buyer's agency service represents buyers and investors in Sydney — market research, property search, due diligence and negotiation, on your side.",
    h1: "A Buyer's Agent Working for You in Sydney",
    intro:
      "We represent you — the buyer or investor — not the seller. Market research, a shortlist of properties that actually match your brief, due diligence, and negotiation handled on your behalf.",
    whoFor: [
      "Buyers who want independent representation, not the selling agent's advice",
      "Investors building a portfolio who want disciplined property selection",
      "Interstate or overseas buyers who can't attend inspections themselves",
      "Busy professionals who want the search and shortlisting done for them",
    ],
    included: [
      "A clear buyer's brief — budget, must-haves and deal-breakers",
      "Off-market and on-market property search",
      "Property shortlisting and inspection coordination",
      "Due diligence support",
      "Negotiation handled on your behalf through to exchange",
    ],
    process: [
      { title: "Share your brief", body: "Area, budget, property type and what matters most to you." },
      { title: "We search and shortlist", body: "On and off-market properties matched to your brief, not a generic portal search." },
      { title: "We inspect and assess", body: "We attend inspections, flag issues, and bring you a shortlist worth considering." },
      { title: "We negotiate for you", body: "Offer strategy and negotiation handled on your behalf, through to exchange." },
    ],
    faqs: [
      {
        question: "What's the difference between a buyer's agent and a regular real estate agent?",
        answer:
          "A selling agent represents the seller and is paid by the seller to get the best price for them. A buyer's agent is engaged by you, the buyer, and works to find and negotiate the right property for your budget and brief.",
      },
      {
        question: "Can you help if I'm buying from interstate or overseas?",
        answer: "Yes — we regularly represent buyers who can't attend inspections themselves, handling the search, due diligence and negotiation locally on your behalf.",
      },
      {
        question: "What areas do you search in?",
        answer: "Tell us your area of interest when you enquire — we'll confirm whether it's within our current coverage across Sydney and NSW.",
      },
    ],
    cta: "Start Your Buyer's Brief",
    bookTab: "buyers",
    related: ["property-sales", "property-management"],
  },
};

export const SERVICE_PAGE_LIST = Object.values(SERVICE_PAGES);
