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
    question: "What services does HR — The Mediator provide in Bangladesh?",
    answer:
      "We provide five core services: airport VIP reception, hotel & car booking, government-request assistance, manpower & security staffing, and courses & careers support covering media training and Gulf study/work placement.",
  },
  {
    question: "Do you provide airport VIP assistance?",
    answer:
      "Yes. Our airport VIP service covers meet & greet, arrival and departure assistance, fast-track support, and passenger coordination at Bangladesh airports including Hazrat Shahjalal International (Dhaka).",
  },
  {
    question: "Can you arrange hotel and car services?",
    answer:
      "Yes. We arrange hotel bookings and vehicle transport — including airport transfers and chauffeur service — matched to your itinerary, budget and preferred city in Bangladesh.",
  },
  {
    question: "Can you assist with government-related requests?",
    answer:
      "Yes. Our desk reviews each government-related case individually and coordinates documentation and administrative processes such as passport, visa, NID, land registry, and attestation support.",
  },
  {
    question: "Do you provide manpower and security services?",
    answer:
      "Yes. We supply licensed manpower and security personnel for businesses and organisations, drawing on our staffing and consultancy practice.",
  },
  {
    question: "Can you help with Gulf employment opportunities?",
    answer:
      "Yes. Our International Careers track supports Gulf employment placement, including documentation and pre-departure assistance for candidates from Bangladesh.",
  },
  {
    question: "Can you help students study in the Gulf?",
    answer:
      "Yes. We provide study-abroad guidance, university admission support, and visa/documentation assistance for students pursuing education opportunities in the Gulf and other regions.",
  },
  {
    question: "How can I request a service?",
    answer:
      "Use the Request a Service button on any page. Choose the service you need, share your contact details and request description, and our team will follow up directly.",
  },
];

export const SERVICE_PAGES: Record<string, ServicePageData> = {
  "airport-vip": {
    id: "airport-vip",
    path: "/airport-vip",
    navLabel: "Airport VIP",
    title: "Airport VIP Reception",
    metaTitle: "Airport VIP Service Bangladesh | HR — The Mediator",
    metaDescription:
      "Airport VIP meet & greet, arrival and departure assistance in Bangladesh. Fast-track support, baggage assistance and passenger coordination at Dhaka and other Bangladesh airports.",
    h1: "Airport VIP Reception in Bangladesh",
    intro:
      "A meet-and-greet officer at the aircraft door, fast-track immigration support, baggage assistance, and a car already waiting at the curb. Our airport VIP service is built for travellers, families and business visitors who want a smooth, well-coordinated arrival or departure anywhere in Bangladesh.",
    whoFor: [
      "International visitors arriving in Dhaka, Chattogram or Sylhet",
      "Bangladeshi families welcoming relatives home",
      "Business travellers on a tight schedule",
      "Overseas Bangladeshis returning for a visit",
      "Elderly or first-time travellers who want extra support",
    ],
    included: [
      "Meet & greet at the aircraft door or terminal entrance",
      "Fast-track immigration and customs coordination",
      "Baggage assistance, door to door",
      "Lounge access arranged on request",
      "Car staged at the curb for onward travel",
      "Support for both arrivals and departures",
    ],
    process: [
      { title: "Choose Airport VIP", body: "Select the airport VIP service on our request form." },
      { title: "Share your flight details", body: "Tell us your flight number, arrival date and airport." },
      { title: "We coordinate on the ground", body: "Our team arranges the meet & greet and transport in advance." },
      { title: "Arrive with support", body: "You're met at the gate and assisted through to your car." },
    ],
    faqs: [
      {
        question: "Which airports do you cover?",
        answer:
          "We cover Hazrat Shahjalal International (Dhaka), Shah Amanat International (Chattogram) and Osmani International (Sylhet).",
      },
      {
        question: "Can you arrange airport assistance for elderly travellers?",
        answer: "Yes — let us know in your request notes and we'll arrange extra support at the airport.",
      },
      {
        question: "Do you also handle departures?",
        answer: "Yes. Airport VIP covers both arrival and departure assistance.",
      },
      {
        question: "How much notice do you need?",
        answer:
          "Submit your request as early as possible; for most flights we can confirm arrangements within 24–48 hours.",
      },
    ],
    cta: "Request Airport VIP",
    bookTab: "airport",
    related: ["hotel-car", "government-request"],
  },

  "hotel-car": {
    id: "hotel-car",
    path: "/hotel-car",
    navLabel: "Hotel & Car",
    title: "Hotel & Car Booking",
    metaTitle: "Hotel and Car Service Bangladesh | Chauffeur Service | HR — The Mediator",
    metaDescription:
      "Hotel booking and chauffeur/car service across Bangladesh. Airport transfers, vetted hotels, and vehicles matched to your itinerary and budget.",
    h1: "Hotel & Car Booking Across Bangladesh",
    intro:
      "We shortlist and reserve accommodation and transport against your schedule and budget — not a generic booking-site listing, but a fit checked by someone who knows the ground in Dhaka, Rajshahi and beyond.",
    whoFor: [
      "Business travellers who need a reliable hotel and vehicle on short notice",
      "Families visiting Bangladesh who want vetted, comfortable accommodation",
      "International visitors unfamiliar with local hotel and transport options",
      "Organisations booking for staff or delegations",
    ],
    included: [
      "Vetted hotels, from standard to luxury",
      "Airport transfers and point-to-point transport",
      "Sedan, SUV or van, with or without driver",
      "Itinerary-matched scheduling",
      "One invoice, one point of contact",
    ],
    process: [
      { title: "Choose Hotel & Car", body: "Select the hotel & car service on our request form." },
      { title: "Tell us your itinerary", body: "Share your city, dates and vehicle preference." },
      { title: "We coordinate the booking", body: "Our team confirms hotel and transport arrangements." },
      { title: "Travel with support", body: "Your car and accommodation are ready when you arrive." },
    ],
    faqs: [
      {
        question: "Which cities do you cover for hotel and car bookings?",
        answer: "Dhaka, Rajshahi and other major Bangladesh cities on request — tell us your destination.",
      },
      {
        question: "Can I request a chauffeur-driven car only, without a hotel?",
        answer: "Yes — hotel and car can be booked separately or together, whichever you need.",
      },
      {
        question: "Do you handle airport transfers?",
        answer: "Yes, airport transfers are part of our standard hotel & car service.",
      },
    ],
    cta: "Request Hotel & Car",
    bookTab: "hotel",
    related: ["airport-vip", "manpower-security"],
  },

  "government-request": {
    id: "government-request",
    path: "/government-request",
    navLabel: "Government Request",
    title: "Government Request Assistance",
    metaTitle: "Government Assistance Bangladesh | Passport, Visa & Documentation | HR — The Mediator",
    metaDescription:
      "Government-request assistance in Bangladesh: passport, visa, NID, land registry and document attestation support. Our desk reviews every case individually.",
    h1: "Government Request Assistance in Bangladesh",
    intro:
      "Passport, visa, land records, attestation, trade licences — our desk reviews every case individually and carries it through the registry office, so you don't have to stand in the queue yourself.",
    whoFor: [
      "Individuals needing passport, visa or NOC support",
      "Families handling NID or birth certificate corrections",
      "Landowners requiring land registry or mutation support",
      "Businesses needing trade licence or registration assistance",
      "Overseas Bangladeshis who cannot attend government offices in person",
    ],
    included: [
      "Passport application support",
      "Visa extension / NOC assistance",
      "NID / birth certificate correction",
      "Land registry & mutation support",
      "Document attestation / notarization",
      "Trade licence / business registration support",
      "Direct phone briefing before any work begins",
    ],
    process: [
      { title: "Choose Government Request", body: "Select the government-request service on our form." },
      { title: "Describe your case", body: "Tell us which service you need and the details of your case." },
      { title: "We review & confirm scope", body: "Our desk reviews your case and briefs you by phone before work begins." },
      { title: "We coordinate the process", body: "Our team carries the case through the relevant government office." },
    ],
    faqs: [
      {
        question: "What government services can you help with?",
        answer:
          "Passport applications, visa extensions/NOCs, NID and birth certificate corrections, land registry and mutation, document attestation, and trade licence or business registration.",
      },
      {
        question: "Will someone review my case before starting work?",
        answer:
          "Yes — our desk reviews every government request individually and confirms scope with you by phone before any work begins.",
      },
      {
        question: "Can you help if I live outside Bangladesh?",
        answer: "Yes, we regularly assist overseas Bangladeshis who cannot attend government offices in person.",
      },
    ],
    cta: "Request Government Assistance",
    bookTab: "government",
    related: ["airport-vip", "study-work-gulf"],
  },

  "manpower-security": {
    id: "manpower-security",
    path: "/manpower-security",
    navLabel: "Manpower & Security",
    title: "Manpower & Security",
    metaTitle: "Manpower & Security Services Bangladesh | HR — The Mediator",
    metaDescription:
      "Licensed manpower and security services for businesses and organisations in Bangladesh — staffing, security personnel and outsourced workforce support.",
    h1: "Manpower & Security Services for Bangladesh Businesses",
    intro:
      "Trained security personnel and outsourced workforce for organisations, drawing on a licensed staffing and consultancy practice built over years of government and corporate contracts.",
    whoFor: [
      "Businesses needing outsourced or temporary staffing",
      "Organisations requiring trained security personnel",
      "Institutions with recurring workforce or compliance needs",
      "Companies preparing documentation for staffing contracts",
    ],
    included: [
      "Licensed staffing & security personnel",
      "Corporate & institutional contracts",
      "Documentation and compliance handled",
      "Gulf & overseas placement support for workforce needs",
    ],
    process: [
      { title: "Choose Manpower & Security", body: "Tell us about your staffing or security requirement." },
      { title: "Share your requirement", body: "Describe the roles, numbers and location needed." },
      { title: "We coordinate placement", body: "Our team matches and coordinates suitable personnel." },
      { title: "Ongoing support", body: "We remain your point of contact for the engagement." },
    ],
    faqs: [
      {
        question: "Do you provide security personnel for events or offices?",
        answer: "Yes, we supply trained security personnel for both short-term and ongoing engagements.",
      },
      {
        question: "Can you supply outsourced staff for a business?",
        answer: "Yes, we support corporate and institutional staffing contracts across Bangladesh.",
      },
    ],
    cta: "Request Manpower & Security",
    bookTab: null,
    related: ["government-request", "study-work-gulf"],
  },

  "courses-careers": {
    id: "courses-careers",
    path: "/courses-careers",
    navLabel: "Courses & Careers",
    title: "Courses & Careers",
    metaTitle: "Courses & Careers Bangladesh | Media Training & Gulf Careers | HR — The Mediator",
    metaDescription:
      "Two career tracks from HR — The Mediator: the Media & Public Speaking Academy, and International Careers support for study and work in the Gulf.",
    h1: "Courses & Careers",
    intro:
      "Beyond logistics — the training and placement work HR — The Mediator is known for. Two clear tracks: professional media and public-speaking training, and international careers support for studying or working in the Gulf.",
    whoFor: [
      "Students preparing for media, presentation or public-speaking careers",
      "Professionals wanting stronger communication and presentation skills",
      "Students exploring university study abroad, including the Gulf",
      "Jobseekers looking for Gulf employment opportunities",
    ],
    included: [
      "Media & Public Speaking Academy — presentation, communication and confidence training",
      "International Careers — study-abroad guidance and Gulf employment support",
      "Visa and documentation assistance for placements",
      "Pre-departure assistance for students and workers",
    ],
    process: [
      { title: "Choose your track", body: "Media & Public Speaking, or International Careers." },
      { title: "Submit your request", body: "Tell us your background and what you're aiming for." },
      { title: "We coordinate the right support", body: "Our team matches you with the right programme or placement path." },
      { title: "Get assistance start to finish", body: "From enrolment or placement through to documentation." },
    ],
    faqs: [
      {
        question: "What is the Media & Public Speaking Academy?",
        answer:
          "Training designed to improve public speaking, communication, presentation skills, media skills and professional confidence.",
      },
      {
        question: "What does International Careers cover?",
        answer:
          "Overseas university admission, study-abroad guidance, Gulf employment opportunities, career placement, and visa/documentation and pre-departure support.",
      },
    ],
    cta: "Explore Courses & Careers",
    bookTab: "programs",
    related: ["media-public-speaking", "study-work-gulf"],
  },

  "media-public-speaking": {
    id: "media-public-speaking",
    path: "/media-public-speaking",
    navLabel: "Media & Public Speaking Academy",
    title: "Media & Public Speaking Academy",
    metaTitle: "Media & Public Speaking Training Bangladesh | HR — The Mediator",
    metaDescription:
      "Media and public-speaking training in Bangladesh — presentation, communication, reporting and confidence skills, taught by a working national news presenter.",
    h1: "Media & Public Speaking Academy",
    intro:
      "Learn presentation skills from someone who does it on air. News & event hosting, correct pronunciation, radio announcing, reporting, language and public speaking, and soft-skills development — taught by a working national news presenter.",
    whoFor: [
      "Students who want to improve public speaking and confidence",
      "Aspiring news presenters and media professionals",
      "Professionals preparing for presentations or public roles",
      "Anyone wanting stronger communication skills",
    ],
    included: [
      "Public speaking and presentation training",
      "Communication and pronunciation coaching",
      "News & event hosting practice",
      "Radio announcing and reporting fundamentals",
      "Professional confidence and soft-skills development",
    ],
    process: [
      { title: "Choose Media & Public Speaking", body: "Select this programme on our request form." },
      { title: "Tell us your background", body: "Share your current education or occupation and goals." },
      { title: "We confirm your batch", body: "Offline (Bangladesh campus) or online (Zoom) batches available." },
      { title: "Begin training", body: "Start the academy with ongoing support from our team." },
    ],
    faqs: [
      {
        question: "Who teaches the Media & Public Speaking Academy?",
        answer: "Our lead trainer is a working national news presenter with on-air experience.",
      },
      {
        question: "Is the course offered online?",
        answer: "Yes, both an offline Bangladesh-campus batch and an online Zoom batch are available.",
      },
    ],
    cta: "Explore the Academy",
    bookTab: "programs",
    related: ["study-work-gulf", "courses-careers"],
  },

  "study-work-gulf": {
    id: "study-work-gulf",
    path: "/study-work-gulf",
    navLabel: "International Careers — Study & Work in the Gulf",
    title: "International Careers — Study & Work in the Gulf",
    metaTitle: "Study and Work in the Gulf from Bangladesh | Gulf Jobs & University Admission | HR — The Mediator",
    metaDescription:
      "Study-abroad guidance and Gulf employment support for candidates from Bangladesh — university admission, career placement, visa and pre-departure assistance.",
    h1: "Study & Work in the Gulf — International Careers",
    intro:
      "Verified placement, not a broker's promise. Manpower export and recruitment support for the UAE, Qatar, Saudi Arabia and wider Gulf markets, plus study-abroad guidance for students, drawing on our licensed staffing and outsourcing practice.",
    whoFor: [
      "Students seeking university admission or study-abroad guidance",
      "Jobseekers pursuing Gulf employment opportunities",
      "Overseas Bangladeshis planning a move to the Gulf",
      "Families needing pre-departure and documentation support",
    ],
    included: [
      "Overseas university admission support",
      "Study-abroad guidance",
      "Gulf employment opportunities and career placement",
      "Visa and documentation support",
      "Pre-departure assistance",
    ],
    process: [
      { title: "Choose International Careers", body: "Select this programme on our request form." },
      { title: "Share your goals", body: "Study or work, target country, and your current background." },
      { title: "We coordinate placement", body: "Our team matches you with a suitable university or employment path." },
      { title: "Pre-departure support", body: "Documentation and visa assistance ahead of travel." },
    ],
    faqs: [
      {
        question: "Which Gulf countries do you support placement for?",
        answer: "The UAE, Qatar, Saudi Arabia, and wider Gulf markets.",
      },
      {
        question: "Do you help with visa and documentation?",
        answer: "Yes, visa and documentation support plus pre-departure assistance are included.",
      },
    ],
    cta: "Explore International Careers",
    bookTab: "programs",
    related: ["media-public-speaking", "manpower-security"],
  },
};

export const SERVICE_PAGE_LIST = Object.values(SERVICE_PAGES);
