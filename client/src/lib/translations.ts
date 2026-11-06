// ARK Property Solution is English-only. Every leaf keeps the legacy
// { en, bn } shape (bn === en) purely so the existing useT()/useDict()
// plumbing in ../lib/i18n keeps working without touching every call site —
// there is no language toggle anymore and `lang` always resolves to "en".
function dup(en: string) {
  return { en, bn: en };
}

export const header = {
  tagline: dup("Real Estate · Property Management · Buyer's Agency"),
  home: dup("Home"),
  sales: dup("Sell / Appraisal"),
  management: dup("Property Management"),
  buyersAgency: dup("Buyer's Agency"),
  aboutUs: dup("About Us"),
  contact: dup("Contact"),
  trackRequest: dup("Track Enquiry"),
  requestService: dup("Get in Touch"),
  requestShort: dup("Enquire"),
  menu: dup("Menu"),
  staffLogin: dup("Staff Login"),
};

export const footer = {
  servicesHeading: dup("Services"),
  quickLinksHeading: dup("Quick Links"),
  contactHeading: dup("Contact"),
  home: dup("Home"),
  aboutUs: dup("About Us"),
  contact: dup("Contact"),
  trackARequest: dup("Track an Enquiry"),
  staffLogin: dup("Staff Login"),
  requestService: dup("Get in Touch"),
  copyright: dup("ARK Property Solution. All rights reserved."),
  privacyPolicy: dup("Privacy Policy"),
  termsConditions: dup("Terms & Conditions"),
};

export const finalCta = {
  heading: dup("Ready to talk about your property?"),
  requestService: dup("Get in Touch"),
};

export const faqDefault = {
  eyebrow: dup("FAQ"),
  title: dup("Frequently Asked Questions"),
};

export const howItWorks = {
  eyebrow: dup("Simple process"),
  h2: dup("How ARK Property Solution Works"),
  steps: [
    { title: dup("Tell Us What You Need"), body: dup("Selling, renting out, or buying — share a few details through our enquiry form.") },
    { title: dup("We Review Your Case"), body: dup("Our team looks at your property or brief and gets back to you directly.") },
    { title: dup("We Get to Work"), body: dup("Appraisal, management onboarding, or a tailored property search — whichever fits your enquiry.") },
    { title: dup("Clear Updates Throughout"), body: dup("You hear from us at every meaningful step, not just at the end.") },
  ],
  cta: dup("Get in Touch"),
};

export const whyChooseUs = {
  eyebrow: dup("Why choose us"),
  h2: dup("Built on Local Knowledge and Straight Talk"),
  reasons: [
    { title: dup("Sydney Market Knowledge"), body: dup("We work Sydney's market every day — pricing, demand and timing advice grounded in what's actually happening locally.") },
    { title: dup("One Point of Contact"), body: dup("Whether you're selling, renting out, or searching, the same team stays with your case from first enquiry to close.") },
    { title: dup("Three Services, One Standard"), body: dup("Sales, property management and buyer's agency all run on the same careful, transparent process.") },
    { title: dup("Straightforward Communication"), body: dup("Clear updates and honest advice — including when a property or price isn't the right fit.") },
  ],
};

export const statsRow = {
  coreServices: dup("Core Services"),
  serviceArea: dup("Primary Service Area"),
  clientTypes: dup("Client Types We Serve"),
  sydney: dup("Sydney, NSW"),
  ourHome: dup("Our Home"),
};

export const homeFaqs = [
  {
    question: dup("What does ARK Property Solution do?"),
    answer: dup(
      "We're a Sydney-based real estate agency covering three services: real estate sales (appraisals, marketing and negotiation for sellers), property management (end-to-end rental management for landlords), and buyer's agency (independent representation for buyers and investors)."
    ),
  },
  {
    question: dup("Which areas do you cover?"),
    answer: dup("We're based in Sydney and primarily serve clients across New South Wales. Get in touch with your suburb or area and we'll confirm whether it's within our current coverage."),
  },
  {
    question: dup("I want to sell my property — what's the first step?"),
    answer: dup("Submit a sales enquiry with your property address and a little about your timeframe. We'll follow up to arrange an appraisal and walk you through our marketing and sale process."),
  },
  {
    question: dup("I'm a landlord — can you manage my rental property?"),
    answer: dup("Yes. Our property management service covers tenant placement, rent collection, routine inspections and maintenance coordination. Submit a property management enquiry and we'll talk through onboarding."),
  },
  {
    question: dup("What is a buyer's agent, and do I need one?"),
    answer: dup("A buyer's agent represents you, the buyer or investor — not the seller. We research the market, shortlist properties, handle due diligence and negotiate on your behalf. Useful if you want independent representation, are buying from out of area, or simply want the search and negotiation handled for you."),
  },
  {
    question: dup("Is there a fee to enquire?"),
    answer: dup("No — submitting an enquiry through our website is free. Any service fees (e.g. management commission, buyer's agency fee) are discussed and agreed with you directly before any paid engagement begins."),
  },
  {
    question: dup("How do I get in touch?"),
    answer: dup("Use the \"Get in Touch\" button on any page, choose the service that fits (sales, property management, buyer's agency, or a general enquiry), and share your contact details. Our team will follow up directly."),
  },
];

export const identityFields = {
  fullName: dup("Full name"),
  phoneWhatsapp: dup("Phone"),
  email: dup("Email"),
  dob: dup("Date of birth"),
};

export const bookingT = {
  submitting: dup("Submitting…"),
  submitSales: dup("Submit Sales Enquiry"),
  submitManagement: dup("Submit Property Management Enquiry"),
  submitBuyers: dup("Submit Buyer's Brief"),
  submitGeneral: dup("Send Enquiry"),
  errorFallback: dup("Something went wrong. Please try again."),
  ticketSaved: dup("Enquiry {ticket} received — our team will be in touch. You can track its status anytime with this reference."),
  defaultHeading: dup("Get in Touch"),
  defaultSubheading: dup("Choose the service you need. Every enquiry gets a reference number you can track."),
  tabs: {
    sales: dup("Sell / Appraisal"),
    management: dup("Property Management"),
    buyers: dup("Buyer's Agency"),
    general: dup("General Enquiry"),
  },
  fields: {
    description: dup("Message"),
    propertyAddress: dup("Property address"),
    propertyType: dup("Property type"),
    selectPropertyType: dup("Select a property type"),
    timeframe: dup("Timeframe"),
    currentStatus: dup("Current status"),
    areaOfInterest: dup("Suburb / area of interest"),
    budgetRange: dup("Budget range"),
    enquiryType: dup("What's this about?"),
  },
  placeholders: {
    propertyAddressExample: dup("e.g. 12 Smith Street, Parramatta NSW"),
    areaExample: dup("e.g. Parramatta, Inner West, North Shore"),
    salesNotes: dup("Anything about the property or your timeline we should know"),
    managementNotes: dup("Anything about the property or tenancy we should know"),
    buyersNotes: dup("What are you looking for — must-haves, deal-breakers, must-see features"),
    generalNotes: dup("Tell us a little about what you need"),
  },
  propertyTypes: ["House", "Apartment / Unit", "Townhouse", "Land", "Other"].map(dup),
  timeframes: ["ASAP", "1–3 months", "3–6 months", "Just researching"].map(dup),
  statusOptions: ["Currently vacant", "Currently tenanted", "New purchase, settling soon"].map(dup),
  budgetRanges: ["Under $700k", "$700k – $1M", "$1M – $1.5M", "$1.5M – $2M", "$2M+", "Prefer to discuss"].map(dup),
};

export const trackRequestT = {
  h2: dup("Track an Enquiry"),
  subtitle: dup("Enter your reference number, full name, and date of birth exactly as submitted."),
  ticketNumber: dup("Reference number"),
  fullName: dup("Full name"),
  dob: dup("Date of birth"),
  checkStatus: dup("Check Status"),
  notFound: dup("We couldn't find a matching enquiry. Double-check your reference number, name and date of birth, or get in touch directly."),
  rejected: dup("This enquiry wasn't able to proceed."),
  contactDeskFallback: dup("Get in touch for details."),
  stageLabels: {
    received: dup("Received — pending review"),
    approved: dup("In progress"),
    approvedFeeDue: dup("In progress"),
    paid: dup("In progress"),
    completed: dup("Completed"),
  },
};

export const servicePageUi = {
  whoThisIsFor: dup("Who This Is For"),
  whatsIncluded: dup("What's Included"),
  howTheProcessWorks: dup("How the Process Works"),
  bookingSubheading: dup("Fill in the details below and our team will follow up directly."),
  relatedServices: dup("Related Services"),
  faqsSuffix: dup("FAQs"),
};

export const aboutPageT = {
  eyebrow: dup("About Us"),
  h1: dup("A Sydney Property Team You Can Rely On"),
  intro: dup(
    "ARK Property Solution is a Sydney-based real estate agency built around three services: real estate sales, property management and buyer's agency — one team across the services you're likely to need over the life of a property."
  ),
  meaningH2: dup("How We Work"),
  meaningBody: dup(
    "Every enquiry gets a direct response from someone who actually works your case — not a call centre. We're upfront about pricing, timeframes and whether a property or strategy is genuinely the right fit, because that's what keeps clients coming back for the next property, not just this one."
  ),
  exploreH2: dup("Explore Our Services"),
  exploreBody: dup("Real estate sales, property management, and buyer's agency."),
  viewAllServices: dup("View All Services"),
};

export const aboutCredibility = [
  {
    heading: dup("Three services, one team"),
    body: dup("Sales, property management and buyer's agency, coordinated by the same desk so your file doesn't get passed around."),
  },
  {
    heading: dup("Sydney-based, Sydney-focused"),
    body: dup("Based in Sydney and focused on the NSW market we work day to day, not a generic national franchise playbook."),
  },
  {
    heading: dup("Straight answers"),
    body: dup("If a price, property or timeline isn't realistic, we'll tell you — before you commit, not after."),
  },
];

export const contactPageT = {
  eyebrow: dup("Contact"),
  h1: dup("Get in Touch"),
  intro: dup("Reach us directly, or submit an enquiry below and we'll follow up right away."),
  requestService: dup("Get in Touch"),
  fallbackReachDesk: dup("Reach us"),
  fallbackFindUs: dup("Office"),
};
