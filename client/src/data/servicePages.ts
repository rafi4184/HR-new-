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
      "Five core services: airport VIP reception, hotel & car booking, government-request assistance, manpower & security staffing, and courses & careers support covering media training and Gulf study/work placement.",
  },
  {
    question: "Do you provide airport VIP assistance?",
    answer:
      "We do. Our airport VIP service covers meet & greet, arrival and departure assistance, fast-track support, and passenger coordination at Bangladesh airports including Hazrat Shahjalal International (Dhaka).",
  },
  {
    question: "Can you arrange hotel and car services?",
    answer:
      "We arrange hotel bookings and vehicle transport — including airport transfers and chauffeur service — matched to your itinerary, budget and preferred city in Bangladesh.",
  },
  {
    question: "Can you assist with government-related requests?",
    answer:
      "Our desk reviews each government-related case individually and coordinates documentation and administrative processes such as passport, visa, NID, land registry, and attestation support.",
  },
  {
    question: "Do you provide manpower and security services?",
    answer:
      "We supply licensed manpower and security personnel for businesses and organisations, drawing on our staffing and consultancy practice.",
  },
  {
    question: "Can you help with Gulf employment opportunities?",
    answer:
      "Our International Careers track supports Gulf employment placement, including documentation and pre-departure assistance for candidates from Bangladesh.",
  },
  {
    question: "Do you help people in Dhaka find jobs in Saudi Arabia or the Middle East?",
    answer:
      "Candidates based in Dhaka, Rajshahi or anywhere in Bangladesh can apply through our International Careers programme for employment in Saudi Arabia, the UAE, Qatar and the wider Middle East, with documentation and pre-departure support included.",
  },
  {
    question: "Do you offer premium or VIP service at Dhaka International Airport?",
    answer:
      "Yes. Our Airport VIP Reception covers all of Dhaka International Airport (Hazrat Shahjalal International), including the modern Terminal 3 — meet & greet, fast-track immigration, baggage assistance and a car staged at the curb for arrivals and departures.",
  },
  {
    question: "Where can I get airport VIP service in Bangladesh?",
    answer:
      "HR — The Mediator provides airport VIP service at Hazrat Shahjalal International Airport in Dhaka, plus Shah Amanat International (Chattogram) and Osmani International (Sylhet) — meet & greet, fast-track immigration and baggage assistance for arrivals and departures anywhere in Bangladesh.",
  },
  {
    question: "Can you help students study in the Gulf?",
    answer:
      "We provide study-abroad guidance, university admission support, and visa/documentation assistance for students pursuing education opportunities in the Gulf and other regions.",
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
    metaTitle: "Dhaka International Airport VIP Service & Pickup | Bangladesh | HR — The Mediator",
    metaDescription:
      "Premium VIP meet & greet at Dhaka International Airport (Hazrat Shahjalal International). Fast-track immigration, baggage assistance and passenger coordination for arrivals and departures across Bangladesh airports.",
    h1: "Dhaka International Airport VIP Reception & Pickup",
    intro:
      "A meet-and-greet officer waiting at Dhaka International Airport (Hazrat Shahjalal International), fast-track immigration support, baggage assistance, and a car already staged at the curb for your Dhaka airport pickup. Our premium airport VIP service covers every terminal — including the modern Terminal 3 — for travellers, families and business visitors who want a smooth, well-coordinated arrival or departure anywhere in Bangladesh.",
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
      { title: "Request your reception", body: "Select Airport VIP on our request form — takes under a minute." },
      { title: "Send us your flight details", body: "Flight number, date, and which airport — Dhaka, Chattogram or Sylhet." },
      { title: "We arrange it on the ground", body: "Meet & greet and transport are set up before you land." },
      { title: "Walk straight to your car", body: "An officer meets you at the gate and walks you through to a car already waiting." },
    ],
    faqs: [
      {
        question: "Which airports do you cover?",
        answer:
          "We cover Dhaka International Airport (Hazrat Shahjalal International, including Terminal 3), Shah Amanat International (Chattogram) and Osmani International (Sylhet).",
      },
      {
        question: "Can you arrange airport assistance for elderly travellers?",
        answer: "Let us know in your request notes and we'll arrange extra support at the airport.",
      },
      {
        question: "Do you also handle departures?",
        answer: "Airport VIP covers both arrival and departure assistance.",
      },
      {
        question: "How much notice do you need?",
        answer:
          "Submit your request as early as possible; for most flights we can confirm arrangements within 24–48 hours.",
      },
      {
        question: "What is Dhaka airport VIP service?",
        answer:
          "Dhaka airport VIP service is a meet & greet and passenger-assistance package at Dhaka International Airport (Hazrat Shahjalal International Airport) — an officer meets you at the aircraft door or terminal entrance, coordinates fast-track immigration and customs, handles baggage, and has a car waiting at the curb, so you skip the usual arrival or departure queues and confusion.",
      },
      {
        question: "How do I book VIP assistance at Dhaka international airport?",
        answer:
          "Submit a request through our Airport VIP request form with your flight number, arrival or departure date, and the airport. Our desk confirms the arrangement and coordinates the meet & greet in advance of your flight.",
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
      "We shortlist and personally check accommodation and transport against your schedule and budget, drawing on first-hand knowledge of hotels and drivers in Dhaka, Rajshahi and beyond.",
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
      { title: "Tell us your trip", body: "City, dates, and the kind of vehicle you need." },
      { title: "We shortlist and confirm", body: "Vetted hotel options and a matched vehicle, confirmed against your budget." },
      { title: "One invoice, one contact", body: "Hotel and transport billed together, one point of contact throughout." },
      { title: "Everything's ready on arrival", body: "Your room and driver are confirmed before you land." },
    ],
    faqs: [
      {
        question: "Which cities do you cover for hotel and car bookings?",
        answer: "Dhaka, Rajshahi and other major Bangladesh cities on request — tell us your destination.",
      },
      {
        question: "Can I request a chauffeur-driven car only, without a hotel?",
        answer: "Hotel and car can be booked separately or together, whichever you need.",
      },
      {
        question: "Do you handle airport transfers?",
        answer: "Airport transfers are part of our standard hotel & car service.",
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
      { title: "Tell us the case", body: "Passport, NID, land registry — whatever the matter, describe it on our form." },
      { title: "We review it personally", body: "Our desk reviews your case and briefs you by phone before any work begins." },
      { title: "We carry it through the office", body: "Our team handles the paperwork and the queue at the relevant government office." },
      { title: "You get a direct update", body: "We confirm once it's done — no chasing required." },
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
          "Our desk reviews every government request individually and confirms scope with you by phone before any work begins.",
      },
      {
        question: "Can you help if I live outside Bangladesh?",
        answer: "We regularly assist overseas Bangladeshis who cannot attend government offices in person.",
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
      { title: "Describe the role", body: "Roles, headcount and location — tell us what needs staffing or securing." },
      { title: "We match and vet", body: "Candidates are matched against your requirement and vetted before you see a name." },
      { title: "Contract and deployment", body: "Documentation and compliance handled, personnel deployed on the agreed date." },
      { title: "One contact, ongoing", body: "We stay your point of contact for the length of the engagement." },
    ],
    faqs: [
      {
        question: "Do you provide security personnel for events or offices?",
        answer: "We supply trained security personnel for both short-term and ongoing engagements.",
      },
      {
        question: "Can you supply outsourced staff for a business?",
        answer: "We support corporate and institutional staffing contracts across Bangladesh.",
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
      { title: "Pick a track", body: "Media & Public Speaking, or International Careers — ask if you're not sure which fits." },
      { title: "Tell us where you're starting from", body: "Your background, education or occupation, and what you're aiming for." },
      { title: "We match you to a path", body: "The right programme or placement route, confirmed with you directly." },
      { title: "Support through to the finish", body: "Enrolment or placement, then documentation — we stay involved throughout." },
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
      { title: "Tell us your goals", body: "Current education or occupation, and what you want to get out of the academy." },
      { title: "Pick your format", body: "An offline Bangladesh-campus batch, or an online Zoom batch — whichever fits." },
      { title: "We confirm your batch", body: "Dates and format locked in, directly with our team." },
      { title: "Train with a working presenter", body: "Sessions led by a working national news presenter, from day one." },
    ],
    faqs: [
      {
        question: "Who teaches the Media & Public Speaking Academy?",
        answer: "Our lead trainer is a working national news presenter with on-air experience.",
      },
      {
        question: "Is the course offered online?",
        answer: "Both an offline Bangladesh-campus batch and an online Zoom batch are available.",
      },
    ],
    cta: "Explore the Academy",
    bookTab: "programs",
    related: ["study-work-gulf", "courses-careers"],
  },

  "study-work-gulf": {
    id: "study-work-gulf",
    path: "/study-work-gulf",
    navLabel: "International Careers — Study & Work Abroad",
    title: "International Careers — Study & Work Abroad",
    metaTitle: "Study Abroad & International Careers — Gulf, Europe & Beyond | HR — The Mediator",
    metaDescription:
      "Study-abroad guidance and international career placement across the Gulf, Europe, North America, Oceania and Asia Pacific, for candidates from Dhaka, Rajshahi and across Bangladesh — university admission, career placement, visa and pre-departure assistance.",
    h1: "Study Abroad & International Careers — Gulf, Europe & Beyond",
    intro:
      "Two clear pathways, one desk: university admission and study-abroad guidance for students, and verified employment placement for jobseekers — across the Gulf, Europe, North America, Oceania and Asia Pacific. Applied for from Dhaka, Rajshahi or anywhere in Bangladesh, drawing on our licensed staffing and outsourcing practice.",
    whoFor: [
      "Students seeking university admission or study-abroad guidance in Europe, the Gulf or beyond",
      "Jobseekers pursuing international employment opportunities",
      "Overseas Bangladeshis planning a move abroad",
      "Families needing pre-departure and documentation support",
    ],
    included: [
      "Overseas university admission support",
      "Study-abroad guidance for Europe, the Gulf and other destinations",
      "International employment opportunities and career placement",
      "Visa and documentation support",
      "Pre-departure assistance",
    ],
    process: [
      {
        title: "Open your file — ৳5,000",
        body: "A one-time fee to open your student or career file. It covers our desk's assessment of your background and documents, and starts your case work.",
      },
      { title: "Tell us study or work", body: "Target country and your current background — student or jobseeker." },
      { title: "We verify the placement", body: "University admission or employer match, checked before anything is confirmed to you." },
      { title: "Visa and documentation", body: "Paperwork handled ahead of travel, not left for the last week." },
      { title: "Pre-departure briefing", body: "A final check-in before you fly, so nothing is a surprise on arrival." },
    ],
    faqs: [
      {
        question: "Is there a fee to start my file?",
        answer:
          "Yes — opening a student or career file costs ৳5,000. This covers our desk's assessment of your background and documents, and starts your case work. Our team will confirm this with you directly after you submit your request.",
      },
      {
        question: "Which countries do you support placement for?",
        answer:
          "The Gulf (Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain), Europe (UK, Ireland, Germany, France, Italy, Spain, Portugal, Netherlands, Poland, Romania, Malta, Cyprus, Sweden, Denmark, Finland), North America (US, Canada), Oceania (Australia, New Zealand) and Asia Pacific (Malaysia, Singapore, Japan, South Korea).",
      },
      {
        question: "How can I apply for study abroad or a job overseas from Dhaka?",
        answer:
          "Submit a request through our International Careers programme with your background and target country. Our Dhaka-based desk reviews your case, matches you with a suitable study or employment path, and handles documentation and pre-departure support.",
      },
      {
        question: "Do you help with visa and documentation?",
        answer: "Visa and documentation support plus pre-departure assistance are included.",
      },
    ],
    cta: "Explore International Careers",
    bookTab: "programs",
    related: ["media-public-speaking", "manpower-security"],
  },
};

export const SERVICE_PAGE_LIST = Object.values(SERVICE_PAGES);
