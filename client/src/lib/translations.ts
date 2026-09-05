// Bangla / English content for every public-facing page. Each leaf is
// { en, bn } — components read the current language via useT() from
// ../lib/i18n. Internal staff/admin screens stay English-only for now.

export const header = {
  tagline: { en: "Trusted Service & Support Partner", bn: "বিশ্বস্ত সেবা ও সহায়তা অংশীদার" },
  home: { en: "Home", bn: "হোম" },
  services: { en: "Services", bn: "সেবাসমূহ" },
  aboutUs: { en: "About Us", bn: "আমাদের সম্পর্কে" },
  contact: { en: "Contact", bn: "যোগাযোগ" },
  trackRequest: { en: "Track Request", bn: "অনুরোধ ট্র্যাক করুন" },
  requestService: { en: "Request a Service", bn: "সেবার জন্য অনুরোধ করুন" },
  requestShort: { en: "Request", bn: "অনুরোধ" },
  menu: { en: "Menu", bn: "মেনু" },
};

export const hero = {
  eyebrow: { en: "Bangladesh · Trusted Service Partner", bn: "বাংলাদেশ · বিশ্বস্ত সেবা অংশীদার" },
  h1: { en: "Your Gateway to Trusted Services in Bangladesh", bn: "বাংলাদেশে বিশ্বস্ত সেবার প্রবেশদ্বার" },
  paragraph: {
    en: "From airport assistance and private transportation to government-request support, manpower, security, education and international careers — HR — The Mediator connects you with the services you need, coordinated by one trusted desk in Bangladesh.",
    bn: "এয়ারপোর্ট সহায়তা ও ব্যক্তিগত পরিবহন থেকে শুরু করে সরকারি কাজে সহায়তা, জনবল, নিরাপত্তা, শিক্ষা ও আন্তর্জাতিক ক্যারিয়ার পর্যন্ত — এইচআর দ্য মিডিয়েটর আপনাকে প্রয়োজনীয় সেবার সাথে যুক্ত করে, বাংলাদেশে একটি বিশ্বস্ত ডেস্কের মাধ্যমে সমন্বিতভাবে।",
  },
  exploreServices: { en: "Explore Services", bn: "সেবাসমূহ দেখুন" },
  requestService: { en: "Request a Service", bn: "সেবার জন্য অনুরোধ করুন" },
};

export const heroOrbit = {
  airport: { en: "Airport VIP Reception", bn: "এয়ারপোর্ট ভিআইপি রিসেপশন" },
  government: { en: "Government Request", bn: "সরকারি কাজে সহায়তা" },
  manpower: { en: "Manpower & Security", bn: "জনবল ও নিরাপত্তা" },
  courses: { en: "Courses & Careers", bn: "কোর্স ও ক্যারিয়ার" },
  scrollCue: { en: "Scroll to explore services", bn: "সেবাসমূহ দেখতে স্ক্রল করুন" },
};

export const servicesGrid = {
  eyebrow: { en: "What we offer", bn: "আমরা যা প্রদান করি" },
  h2: { en: "What Do You Need Help With?", bn: "আপনার কী সহায়তা প্রয়োজন?" },
  intents: {
    travel: { en: "I am travelling", bn: "আমি ভ্রমণ করছি" },
    local: { en: "I need local assistance", bn: "আমার স্থানীয় সহায়তা প্রয়োজন" },
    people: { en: "I need people or security", bn: "আমার জনবল বা নিরাপত্তা প্রয়োজন" },
    abroad: { en: "I want to study or work abroad", bn: "আমি বিদেশে পড়াশোনা বা কাজ করতে চাই" },
  },
  highlightNote: {
    en: "Highlighted above — the services that best match what you told us.",
    bn: "উপরে হাইলাইট করা হয়েছে — আপনি যা বলেছেন তার সাথে সবচেয়ে ভালো মিলে যাওয়া সেবাগুলো।",
  },
};

// Mirrors lib/services.ts SERVICES array order: airport, hotel, government, manpower, courses
export const servicesList = [
  {
    title: { en: "Airport VIP Reception", bn: "এয়ারপোর্ট ভিআইপি রিসেপশন" },
    shortTitle: { en: "Airport VIP", bn: "এয়ারপোর্ট ভিআইপি" },
    summary: {
      en: "Premium airport meet & greet, arrival assistance, departure assistance and passenger support.",
      bn: "প্রিমিয়াম এয়ারপোর্ট মিট অ্যান্ড গ্রিট, আগমন সহায়তা, প্রস্থান সহায়তা এবং যাত্রী সহায়তা।",
    },
    cta: { en: "Explore Airport VIP", bn: "এয়ারপোর্ট ভিআইপি দেখুন" },
  },
  {
    title: { en: "Hotel & Car Booking", bn: "হোটেল ও গাড়ি বুকিং" },
    shortTitle: { en: "Hotel & Car", bn: "হোটেল ও গাড়ি" },
    summary: {
      en: "Hotel arrangements, airport transfers, chauffeur and transportation support.",
      bn: "হোটেল ব্যবস্থাপনা, এয়ারপোর্ট ট্রান্সফার, চালকসহ গাড়ি ও পরিবহন সহায়তা।",
    },
    cta: { en: "Explore Hotel & Car", bn: "হোটেল ও গাড়ি দেখুন" },
  },
  {
    title: { en: "Government Request", bn: "সরকারি কাজের সহায়তা" },
    shortTitle: { en: "Government Request", bn: "সরকারি কাজের সহায়তা" },
    summary: {
      en: "Assistance with government-related requests, documentation and administrative processes.",
      bn: "সরকারি সংক্রান্ত অনুরোধ, প্রয়োজনীয় কাগজপত্র ও প্রশাসনিক প্রক্রিয়ায় সহায়তা।",
    },
    cta: { en: "Explore Government Services", bn: "সরকারি সেবা দেখুন" },
  },
  {
    title: { en: "Manpower & Security", bn: "জনবল ও নিরাপত্তা" },
    shortTitle: { en: "Manpower & Security", bn: "জনবল ও নিরাপত্তা" },
    summary: {
      en: "Professional manpower, staffing and security solutions for businesses and organisations.",
      bn: "প্রতিষ্ঠান ও ব্যবসার জন্য পেশাদার জনবল, স্টাফিং ও নিরাপত্তা সমাধান।",
    },
    cta: { en: "Explore Manpower & Security", bn: "জনবল ও নিরাপত্তা দেখুন" },
  },
  {
    title: { en: "Courses & Careers", bn: "কোর্স ও ক্যারিয়ার" },
    shortTitle: { en: "Courses & Careers", bn: "কোর্স ও ক্যারিয়ার" },
    summary: {
      en: "Professional training, media and public speaking, international education and Gulf career support.",
      bn: "পেশাদার প্রশিক্ষণ, মিডিয়া ও পাবলিক স্পিকিং, আন্তর্জাতিক শিক্ষা ও গালফ ক্যারিয়ার সহায়তা।",
    },
    cta: { en: "Explore Courses & Careers", bn: "কোর্স ও ক্যারিয়ার দেখুন" },
  },
];

export const platformHub = {
  eyebrow: { en: "One Platform", bn: "এক প্ল্যাটফর্ম" },
  h2: { en: "Many Ways We Can Help", bn: "সাহায্য করার নানা উপায়" },
  branches: [
    { label: { en: "Travel", bn: "ভ্রমণ" }, items: [{ en: "Airport VIP", bn: "এয়ারপোর্ট ভিআইপি" }, { en: "Hotel & Car", bn: "হোটেল ও গাড়ি" }] },
    { label: { en: "Support", bn: "সহায়তা" }, items: [{ en: "Government Request", bn: "সরকারি কাজের সহায়তা" }, { en: "Local Assistance", bn: "স্থানীয় সহায়তা" }] },
    { label: { en: "Workforce", bn: "কর্মীবাহিনী" }, items: [{ en: "Manpower", bn: "জনবল" }, { en: "Security", bn: "নিরাপত্তা" }] },
    { label: { en: "Future", bn: "ভবিষ্যৎ" }, items: [{ en: "Courses", bn: "কোর্স" }, { en: "Study & Gulf Careers", bn: "পড়াশোনা ও গালফ ক্যারিয়ার" }] },
  ],
};

export const howItWorks = {
  eyebrow: { en: "Simple process", bn: "সহজ প্রক্রিয়া" },
  h2: { en: "How HR — The Mediator Works", bn: "এইচআর দ্য মিডিয়েটর যেভাবে কাজ করে" },
  steps: [
    { title: { en: "Choose Your Service", bn: "আপনার সেবা বেছে নিন" }, body: { en: "Select the service you need.", bn: "আপনার প্রয়োজনীয় সেবাটি বেছে নিন।" } },
    { title: { en: "Submit Your Request", bn: "আপনার অনুরোধ জমা দিন" }, body: { en: "Tell us what you need and when you need it.", bn: "আমাদের জানান কী প্রয়োজন এবং কখন প্রয়োজন।" } },
    { title: { en: "We Coordinate", bn: "আমরা সমন্বয় করি" }, body: { en: "Our team coordinates the appropriate service and support.", bn: "আমাদের দল উপযুক্ত সেবা ও সহায়তা সমন্বয় করে।" } },
    { title: { en: "Get Assistance", bn: "সহায়তা পান" }, body: { en: "Receive professional support from start to finish.", bn: "শুরু থেকে শেষ পর্যন্ত পেশাদার সহায়তা পান।" } },
  ],
  cta: { en: "Request a Service", bn: "সেবার জন্য অনুরোধ করুন" },
};

export const whyChooseUs = {
  eyebrow: { en: "Why choose us", bn: "কেন আমাদের বেছে নেবেন" },
  h2: { en: "Built on Trust and Coordination", bn: "বিশ্বাস ও সমন্বয়ের ভিত্তিতে গড়া" },
  reasons: [
    { title: { en: "Local Expertise", bn: "স্থানীয় দক্ষতা" }, body: { en: "Years of experience coordinating services on the ground across Bangladesh.", bn: "সারা বাংলাদেশ জুড়ে মাঠ পর্যায়ে সেবা সমন্বয়ের বহু বছরের অভিজ্ঞতা।" } },
    { title: { en: "One Trusted Point of Contact", bn: "একটি বিশ্বস্ত যোগাযোগ কেন্দ্র" }, body: { en: "A single desk coordinates every service, so you're never passed between departments.", bn: "একটি মাত্র ডেস্ক প্রতিটি সেবা সমন্বয় করে, তাই আপনাকে কখনো বিভাগে বিভাগে ঘুরতে হয় না।" } },
    { title: { en: "Professional Coordination", bn: "পেশাদার সমন্বয়" }, body: { en: "Every case is reviewed individually and handled by our team from start to finish.", bn: "প্রতিটি কেস আলাদাভাবে পর্যালোচনা করে আমাদের দল শুরু থেকে শেষ পর্যন্ত পরিচালনা করে।" } },
    { title: { en: "Transparent Communication", bn: "স্বচ্ছ যোগাযোগ" }, body: { en: "Clear updates by phone, so you always know the status of your request.", bn: "ফোনে স্পষ্ট আপডেট, তাই আপনি সবসময় জানতে পারবেন আপনার অনুরোধের অবস্থা।" } },
  ],
};

export const whoWeHelp = {
  eyebrow: { en: "Who we help", bn: "আমরা কাদের সহায়তা করি" },
  h2: { en: "Support for Every Kind of Client", bn: "প্রতিটি ধরনের গ্রাহকের জন্য সহায়তা" },
  groups: [
    { title: { en: "International Visitors", bn: "আন্তর্জাতিক অতিথি" }, body: { en: "Airport VIP reception, hotel and transport arrangements matched to your itinerary.", bn: "আপনার ভ্রমণসূচি অনুযায়ী এয়ারপোর্ট ভিআইপি রিসেপশন, হোটেল ও পরিবহন ব্যবস্থা।" } },
    { title: { en: "Bangladeshi Families", bn: "বাংলাদেশি পরিবার" }, body: { en: "Government-request assistance, travel support, and a trusted point of contact.", bn: "সরকারি কাজে সহায়তা, ভ্রমণ সহায়তা এবং একটি বিশ্বস্ত যোগাযোগ কেন্দ্র।" } },
    { title: { en: "Businesses & Organisations", bn: "ব্যবসা ও প্রতিষ্ঠান" }, body: { en: "Manpower, security staffing, and coordinated logistics for delegations and teams.", bn: "জনবল, নিরাপত্তা স্টাফিং এবং প্রতিনিধিদল ও টিমের জন্য সমন্বিত লজিস্টিকস।" } },
    { title: { en: "Students & Job Seekers", bn: "শিক্ষার্থী ও চাকরিপ্রার্থী" }, body: { en: "Media training, study-abroad guidance, and Gulf career placement support.", bn: "মিডিয়া প্রশিক্ষণ, বিদেশে পড়াশোনার দিকনির্দেশনা ও গালফ ক্যারিয়ার প্লেসমেন্ট সহায়তা।" } },
    { title: { en: "Overseas Bangladeshis", bn: "প্রবাসী বাংলাদেশি" }, body: { en: "Airport reception on return visits, and government-request handling from abroad.", bn: "দেশে ফেরার সময় এয়ারপোর্ট রিসেপশন এবং বিদেশ থেকে সরকারি কাজের সমাধান।" } },
  ],
};

export const coursesCareersTeaser = {
  eyebrow: { en: "Courses & Careers", bn: "কোর্স ও ক্যারিয়ার" },
  h2: { en: "Two career tracks, one team behind you", bn: "দুটি ক্যারিয়ার পথ, একই দল আপনার পাশে" },
  subtitle: {
    en: "Professional training and international placement support — not just media training.",
    bn: "পেশাদার প্রশিক্ষণ ও আন্তর্জাতিক প্লেসমেন্ট সহায়তা — শুধু মিডিয়া প্রশিক্ষণ নয়।",
  },
  trackOneLabel: { en: "Track One", bn: "ট্র্যাক ১" },
  trackOneTitle: { en: "Media & Public Speaking Academy", bn: "মিডিয়া ও পাবলিক স্পিকিং একাডেমি" },
  trackOneBody: {
    en: "Public speaking, communication, presentation skills, media skills and professional confidence — taught by a working national news presenter.",
    bn: "পাবলিক স্পিকিং, যোগাযোগ, উপস্থাপনা দক্ষতা, মিডিয়া দক্ষতা ও পেশাদার আত্মবিশ্বাস — শেখাচ্ছেন একজন কর্মরত জাতীয় সংবাদ উপস্থাপক।",
  },
  trackOneCta: { en: "Explore Academy", bn: "একাডেমি দেখুন" },
  trackTwoLabel: { en: "Track Two", bn: "ট্র্যাক ২" },
  trackTwoTitle: { en: "International Careers — Study & Work in the Gulf", bn: "আন্তর্জাতিক ক্যারিয়ার — গালফে পড়াশোনা ও কাজ" },
  trackTwoBody: {
    en: "Overseas university admission, study-abroad guidance, Gulf employment opportunities, career placement, and visa/pre-departure support.",
    bn: "বিদেশে বিশ্ববিদ্যালয় ভর্তি, বিদেশে পড়াশোনার দিকনির্দেশনা, গালফ কর্মসংস্থানের সুযোগ, ক্যারিয়ার প্লেসমেন্ট এবং ভিসা/প্রস্থান-পূর্ব সহায়তা।",
  },
  trackTwoCta: { en: "Explore International Careers", bn: "আন্তর্জাতিক ক্যারিয়ার দেখুন" },
};

export const statsRow = {
  coreServices: { en: "Core Services", bn: "মূল সেবা" },
  trustedPoint: { en: "Trusted Point of Contact", bn: "বিশ্বস্ত যোগাযোগ কেন্দ্র" },
  customerGroups: { en: "Customer Groups We Serve", bn: "আমরা যাদের সেবা দিই" },
  bangladesh: { en: "Bangladesh", bn: "বাংলাদেশ" },
  ourHome: { en: "Our Home", bn: "আমাদের ঘর" },
};

export const mediaPartners = {
  appearsOn: { en: "Our news-presenter trainer appears on", bn: "আমাদের সংবাদ-উপস্থাপক প্রশিক্ষক যেসব চ্যানেলে উপস্থিত হয়েছেন" },
};

export const events = {
  eyebrow: { en: "On the ground", bn: "মাঠপর্যায়ে" },
  h2: { en: "Recent Events", bn: "সাম্প্রতিক ইভেন্ট" },
};

export const faqDefault = {
  eyebrow: { en: "FAQ", bn: "প্রশ্নোত্তর" },
  title: { en: "Frequently Asked Questions", bn: "সচরাচর জিজ্ঞাসিত প্রশ্ন" },
};

export const homeFaqs = [
  {
    question: { en: "What services does HR — The Mediator provide in Bangladesh?", bn: "এইচআর দ্য মিডিয়েটর বাংলাদেশে কী কী সেবা প্রদান করে?" },
    answer: {
      en: "We provide five core services: airport VIP reception, hotel & car booking, government-request assistance, manpower & security staffing, and courses & careers support covering media training and Gulf study/work placement.",
      bn: "আমরা পাঁচটি মূল সেবা প্রদান করি: এয়ারপোর্ট ভিআইপি রিসেপশন, হোটেল ও গাড়ি বুকিং, সরকারি কাজে সহায়তা, জনবল ও নিরাপত্তা স্টাফিং এবং মিডিয়া প্রশিক্ষণ ও গালফ পড়াশোনা/কাজের প্লেসমেন্টসহ কোর্স ও ক্যারিয়ার সহায়তা।",
    },
  },
  {
    question: { en: "Do you provide airport VIP assistance?", bn: "আপনারা কি এয়ারপোর্ট ভিআইপি সহায়তা প্রদান করেন?" },
    answer: {
      en: "Yes. Our airport VIP service covers meet & greet, arrival and departure assistance, fast-track support, and passenger coordination at Bangladesh airports including Hazrat Shahjalal International (Dhaka).",
      bn: "হ্যাঁ। আমাদের এয়ারপোর্ট ভিআইপি সেবায় রয়েছে মিট অ্যান্ড গ্রিট, আগমন ও প্রস্থান সহায়তা, ফাস্ট-ট্র্যাক সহায়তা এবং হযরত শাহজালাল আন্তর্জাতিক (ঢাকা)সহ বাংলাদেশের বিমানবন্দরে যাত্রী সমন্বয়।",
    },
  },
  {
    question: { en: "Can you arrange hotel and car services?", bn: "আপনারা কি হোটেল ও গাড়ির ব্যবস্থা করতে পারেন?" },
    answer: {
      en: "Yes. We arrange hotel bookings and vehicle transport — including airport transfers and chauffeur service — matched to your itinerary, budget and preferred city in Bangladesh.",
      bn: "হ্যাঁ। আমরা আপনার ভ্রমণসূচি, বাজেট ও পছন্দের শহর অনুযায়ী হোটেল বুকিং ও যানবাহন পরিবহন — এয়ারপোর্ট ট্রান্সফার ও চালকসহ গাড়ি সেবাসহ — ব্যবস্থা করি।",
    },
  },
  {
    question: { en: "Can you assist with government-related requests?", bn: "আপনারা কি সরকারি সংক্রান্ত কাজে সহায়তা করতে পারেন?" },
    answer: {
      en: "Yes. Our desk reviews each government-related case individually and coordinates documentation and administrative processes such as passport, visa, NID, land registry, and attestation support.",
      bn: "হ্যাঁ। আমাদের ডেস্ক প্রতিটি সরকারি সংক্রান্ত কেস আলাদাভাবে পর্যালোচনা করে এবং পাসপোর্ট, ভিসা, এনআইডি, ভূমি নিবন্ধন ও সত্যায়ন সহায়তার মতো কাগজপত্র ও প্রশাসনিক প্রক্রিয়া সমন্বয় করে।",
    },
  },
  {
    question: { en: "Do you provide manpower and security services?", bn: "আপনারা কি জনবল ও নিরাপত্তা সেবা প্রদান করেন?" },
    answer: {
      en: "Yes. We supply licensed manpower and security personnel for businesses and organisations, drawing on our staffing and consultancy practice.",
      bn: "হ্যাঁ। আমরা আমাদের স্টাফিং ও পরামর্শ প্র্যাকটিসের অভিজ্ঞতায় ব্যবসা ও প্রতিষ্ঠানের জন্য লাইসেন্সপ্রাপ্ত জনবল ও নিরাপত্তা কর্মী সরবরাহ করি।",
    },
  },
  {
    question: { en: "Can you help with Gulf employment opportunities?", bn: "আপনারা কি গালফে কর্মসংস্থানের সুযোগে সহায়তা করতে পারেন?" },
    answer: {
      en: "Yes. Our International Careers track supports Gulf employment placement, including documentation and pre-departure assistance for candidates from Bangladesh.",
      bn: "হ্যাঁ। আমাদের আন্তর্জাতিক ক্যারিয়ার ট্র্যাক বাংলাদেশ থেকে প্রার্থীদের জন্য কাগজপত্র ও প্রস্থান-পূর্ব সহায়তাসহ গালফ কর্মসংস্থান প্লেসমেন্টে সহায়তা করে।",
    },
  },
  {
    question: { en: "Can you help students study in the Gulf?", bn: "আপনারা কি শিক্ষার্থীদের গালফে পড়াশোনায় সহায়তা করতে পারেন?" },
    answer: {
      en: "Yes. We provide study-abroad guidance, university admission support, and visa/documentation assistance for students pursuing education opportunities in the Gulf and other regions.",
      bn: "হ্যাঁ। আমরা গালফ ও অন্যান্য অঞ্চলে শিক্ষার সুযোগ খুঁজছেন এমন শিক্ষার্থীদের জন্য বিদেশে পড়াশোনার দিকনির্দেশনা, বিশ্ববিদ্যালয় ভর্তি সহায়তা এবং ভিসা/কাগজপত্র সহায়তা প্রদান করি।",
    },
  },
  {
    question: { en: "How can I request a service?", bn: "আমি কীভাবে একটি সেবার জন্য অনুরোধ করতে পারি?" },
    answer: {
      en: "Use the Request a Service button on any page. Choose the service you need, share your contact details and request description, and our team will follow up directly.",
      bn: "যেকোনো পৃষ্ঠায় থাকা 'সেবার জন্য অনুরোধ করুন' বাটনটি ব্যবহার করুন। আপনার প্রয়োজনীয় সেবা বেছে নিন, আপনার যোগাযোগের তথ্য ও অনুরোধের বিবরণ দিন, আমাদের দল সরাসরি যোগাযোগ করবে।",
    },
  },
];

export const footer = {
  description: {
    en: "Your trusted service & support partner in Bangladesh — concierge, transport, government assistance, manpower, security, education and career services for individuals, families, businesses and international clients.",
    bn: "বাংলাদেশে আপনার বিশ্বস্ত সেবা ও সহায়তা অংশীদার — কনসিয়ার্জ, পরিবহন, সরকারি সহায়তা, জনবল, নিরাপত্তা, শিক্ষা ও ক্যারিয়ার সেবা ব্যক্তি, পরিবার, ব্যবসা ও আন্তর্জাতিক গ্রাহকদের জন্য।",
  },
  servicesHeading: { en: "Services", bn: "সেবাসমূহ" },
  quickLinksHeading: { en: "Quick Links", bn: "দ্রুত লিংক" },
  contactHeading: { en: "Contact", bn: "যোগাযোগ" },
  home: { en: "Home", bn: "হোম" },
  aboutUs: { en: "About Us", bn: "আমাদের সম্পর্কে" },
  contact: { en: "Contact", bn: "যোগাযোগ" },
  trackARequest: { en: "Track a Request", bn: "অনুরোধ ট্র্যাক করুন" },
  staffLogin: { en: "Staff Login", bn: "স্টাফ লগইন" },
  requestService: { en: "Request a Service", bn: "সেবার জন্য অনুরোধ করুন" },
  copyright: { en: "HR — The Mediator Limited. All rights reserved.", bn: "এইচআর দ্য মিডিয়েটর লিমিটেড। সর্বস্বত্ব সংরক্ষিত।" },
  privacyPolicy: { en: "Privacy Policy", bn: "গোপনীয়তা নীতি" },
  termsConditions: { en: "Terms & Conditions", bn: "শর্তাবলী" },
};

export const finalCta = {
  heading: { en: "Need Assistance?", bn: "সহায়তা প্রয়োজন?" },
  requestService: { en: "Request a Service", bn: "সেবার জন্য অনুরোধ করুন" },
};

export const bookingT = {
  tabs: {
    airport: { en: "Airport VIP", bn: "এয়ারপোর্ট ভিআইপি" },
    hotel: { en: "Hotel & car", bn: "হোটেল ও গাড়ি" },
    government: { en: "Government request", bn: "সরকারি অনুরোধ" },
    programs: { en: "Courses & careers", bn: "কোর্স ও ক্যারিয়ার" },
  },
  defaultHeading: { en: "Request a Service", bn: "সেবার জন্য অনুরোধ করুন" },
  defaultSubheading: {
    en: "Pick the service you need. Every request gets a ticket number you can track.",
    bn: "আপনার প্রয়োজনীয় সেবাটি বেছে নিন। প্রতিটি অনুরোধে একটি টিকিট নম্বর দেওয়া হয় যা আপনি ট্র্যাক করতে পারবেন।",
  },
  submitting: { en: "Submitting…", bn: "জমা দেওয়া হচ্ছে…" },
  submitAirport: { en: "Submit airport request", bn: "এয়ারপোর্ট অনুরোধ জমা দিন" },
  submitHotel: { en: "Submit hotel & car request", bn: "হোটেল ও গাড়ির অনুরোধ জমা দিন" },
  submitGovernment: { en: "Submit government request", bn: "সরকারি অনুরোধ জমা দিন" },
  submitProgram: { en: "Submit enrollment request", bn: "ভর্তি অনুরোধ জমা দিন" },
  errorFallback: { en: "Couldn't submit that request. Please try again.", bn: "অনুরোধটি জমা দেওয়া যায়নি। আবার চেষ্টা করুন।" },
  fields: {
    flightNumber: { en: "Flight number", bn: "ফ্লাইট নম্বর" },
    arrivalAirport: { en: "Arrival airport", bn: "আগমন বিমানবন্দর" },
    preferredDate: { en: "Preferred date", bn: "পছন্দের তারিখ" },
    arrivalTime: { en: "Arrival time", bn: "আগমনের সময়" },
    purposeOfVisit: { en: "Purpose of visit", bn: "ভ্রমণের উদ্দেশ্য" },
    travelers: { en: "Travelers", bn: "যাত্রী সংখ্যা" },
    description: { en: "Description of request", bn: "অনুরোধের বিবরণ" },
    locationCity: { en: "Location / City", bn: "অবস্থান / শহর" },
    hotelTier: { en: "Hotel tier", bn: "হোটেল মান" },
    checkin: { en: "Check-in (preferred date)", bn: "চেক-ইন (পছন্দের তারিখ)" },
    checkout: { en: "Check-out", bn: "চেক-আউট" },
    carType: { en: "Car type", bn: "গাড়ির ধরন" },
    pickupLocation: { en: "Pickup location", bn: "পিকআপ স্থান" },
    serviceRequired: { en: "Service required", bn: "প্রয়োজনীয় সেবা" },
    urgency: { en: "Urgency", bn: "জরুরি মাত্রা" },
    program: { en: "Program", bn: "প্রোগ্রাম" },
    preferredBatch: { en: "Preferred batch", bn: "পছন্দের ব্যাচ" },
    currentEducation: { en: "Current education / occupation", bn: "বর্তমান শিক্ষা / পেশা" },
    selectAService: { en: "Select a service", bn: "একটি সেবা নির্বাচন করুন" },
  },
  airports: {
    dhaka: { en: "Hazrat Shahjalal Int'l, Dhaka", bn: "হযরত শাহজালাল আন্তর্জাতিক বিমানবন্দর, ঢাকা" },
    chattogram: { en: "Shah Amanat Int'l, Chattogram", bn: "শাহ আমানত আন্তর্জাতিক বিমানবন্দর, চট্টগ্রাম" },
    sylhet: { en: "Osmani Int'l, Sylhet", bn: "ওসমানী আন্তর্জাতিক বিমানবন্দর, সিলেট" },
  },
  hotelTiers: {
    standard: { en: "Standard", bn: "স্ট্যান্ডার্ড" },
    business: { en: "Business", bn: "বিজনেস" },
    luxury: { en: "Luxury", bn: "লাক্সারি" },
  },
  carOptions: {
    sedanSelf: { en: "Sedan, self-drive", bn: "সেডান, নিজে চালাবেন" },
    sedanDriver: { en: "Sedan, with driver", bn: "সেডান, চালকসহ" },
    suvDriver: { en: "SUV, with driver", bn: "এসইউভি, চালকসহ" },
    vanDriver: { en: "Van, with driver", bn: "ভ্যান, চালকসহ" },
    noCar: { en: "No car needed", bn: "গাড়ি প্রয়োজন নেই" },
  },
  urgencyOptions: {
    standard: { en: "Standard", bn: "স্ট্যান্ডার্ড" },
    urgent: { en: "Urgent", bn: "জরুরি" },
  },
  batchOptions: {
    offline: { en: "Offline, Bangladesh campus", bn: "অফলাইন, বাংলাদেশ ক্যাম্পাস" },
    online: { en: "Online, Zoom", bn: "অনলাইন, জুম" },
    notApplicable: { en: "Not applicable", bn: "প্রযোজ্য নয়" },
  },
  govNotice: {
    en: "Our desk reviews every case individually and confirms scope directly with you by phone before any work begins.",
    bn: "আমাদের ডেস্ক প্রতিটি কেস আলাদাভাবে পর্যালোচনা করে এবং কাজ শুরুর আগে ফোনে সরাসরি আপনার সাথে বিষয়টি নিশ্চিত করে।",
  },
  placeholders: {
    flightExample: { en: "e.g. BG 147", bn: "যেমন BG 147" },
    airportNotes: { en: "Anything else we should know", bn: "অন্য কিছু জানানোর থাকলে লিখুন" },
    cityExample: { en: "Dhaka, Rajshahi...", bn: "ঢাকা, রাজশাহী..." },
    programGoal: { en: "What are you hoping to get out of it?", bn: "আপনি এখান থেকে কী পেতে চান?" },
  },
  ticketSaved: {
    en: "Your ticket number is {ticket}. Save it — you'll need it with your name and date of birth to track this request.",
    bn: "আপনার টিকিট নম্বর {ticket}। এটি সংরক্ষণ করুন — এই অনুরোধ ট্র্যাক করতে আপনার নাম ও জন্মতারিখসহ এটি প্রয়োজন হবে।",
  },
};

export const identityFields = {
  fullName: { en: "Full name", bn: "পূর্ণ নাম" },
  phoneWhatsapp: { en: "Phone / WhatsApp", bn: "ফোন / হোয়াটসঅ্যাপ" },
  email: { en: "Email", bn: "ইমেইল" },
  dob: { en: "Date of birth", bn: "জন্মতারিখ" },
};

export const trackRequestT = {
  h2: { en: "Track Your Request", bn: "আপনার অনুরোধ ট্র্যাক করুন" },
  subtitle: {
    en: "Enter your ticket number, full name, and date of birth exactly as submitted.",
    bn: "জমা দেওয়ার সময় যেভাবে দিয়েছিলেন ঠিক সেভাবে টিকিট নম্বর, পূর্ণ নাম ও জন্মতারিখ লিখুন।",
  },
  ticketNumber: { en: "Ticket number", bn: "টিকিট নম্বর" },
  fullName: { en: "Full name", bn: "পূর্ণ নাম" },
  dob: { en: "Date of birth", bn: "জন্মতারিখ" },
  checkStatus: { en: "Check status", bn: "স্ট্যাটাস দেখুন" },
  notFound: {
    en: "No matching request. Double-check the ticket number, name, and date of birth exactly as submitted.",
    bn: "কোনো মিল পাওয়া যায়নি। জমা দেওয়ার সময় ব্যবহৃত টিকিট নম্বর, নাম ও জন্মতারিখ আবার যাচাই করুন।",
  },
  rejected: { en: "This request was not approved.", bn: "এই অনুরোধটি অনুমোদিত হয়নি।" },
  contactDeskFallback: { en: "Please contact the desk for details.", bn: "বিস্তারিত জানতে ডেস্কে যোগাযোগ করুন।" },
  payButton: { en: "Pay ৳{fee}", bn: "৳{fee} পরিশোধ করুন" },
  stageLabels: {
    received: { en: "Request received", bn: "অনুরোধ গৃহীত হয়েছে" },
    approved: { en: "Approved", bn: "অনুমোদিত" },
    approvedFeeDue: { en: "Approved — fee due", bn: "অনুমোদিত — ফি বাকি" },
    paid: { en: "Paid", bn: "পরিশোধ করা হয়েছে" },
    completed: { en: "Completed", bn: "সম্পন্ন" },
  },
};

export const servicePageUi = {
  whoThisIsFor: { en: "Who This Is For", bn: "এটি কাদের জন্য" },
  whatsIncluded: { en: "What's Included", bn: "যা অন্তর্ভুক্ত" },
  howTheProcessWorks: { en: "How the Process Works", bn: "প্রক্রিয়াটি যেভাবে কাজ করে" },
  bookingSubheading: {
    en: "Fill in the details below and our team will follow up directly.",
    bn: "নিচে বিস্তারিত পূরণ করুন এবং আমাদের দল সরাসরি যোগাযোগ করবে।",
  },
  relatedServices: { en: "Related Services", bn: "সম্পর্কিত সেবাসমূহ" },
  faqsSuffix: { en: "FAQs", bn: "সচরাচর জিজ্ঞাসিত প্রশ্ন" },
};

export const aboutPageT = {
  eyebrow: { en: "About Us", bn: "আমাদের সম্পর্কে" },
  h1: { en: "A Trusted Service Partner in Bangladesh", bn: "বাংলাদেশে একটি বিশ্বস্ত সেবা অংশীদার" },
  intro: {
    en: "HR — The Mediator is a registered manpower, security and consultancy company running a concierge desk, a media training academy, and Gulf employment placement for Bangladesh's travellers, students and jobseekers.",
    bn: "এইচআর দ্য মিডিয়েটর একটি নিবন্ধিত জনবল, নিরাপত্তা ও পরামর্শক প্রতিষ্ঠান, যা বাংলাদেশের ভ্রমণকারী, শিক্ষার্থী ও চাকরিপ্রার্থীদের জন্য একটি কনসিয়ার্জ ডেস্ক, একটি মিডিয়া প্রশিক্ষণ একাডেমি এবং গালফ কর্মসংস্থান প্লেসমেন্ট পরিচালনা করে।",
  },
  founderRole: {
    en: "News Presenter, BTV & Radio Today · Lead Trainer",
    bn: "সংবাদ উপস্থাপক, বিটিভি ও রেডিও টুডে · প্রধান প্রশিক্ষক",
  },
  para1: {
    en: "HR — The Mediator was built to give travellers, families, businesses and jobseekers one trusted point of contact in Bangladesh — instead of chasing separate agents for the airport, the hotel, the government office, the security desk and the training academy.",
    bn: "এইচআর দ্য মিডিয়েটর তৈরি করা হয়েছে ভ্রমণকারী, পরিবার, ব্যবসা ও চাকরিপ্রার্থীদের বাংলাদেশে একটি বিশ্বস্ত যোগাযোগ কেন্দ্র দেওয়ার জন্য — এয়ারপোর্ট, হোটেল, সরকারি অফিস, নিরাপত্তা ডেস্ক ও প্রশিক্ষণ একাডেমির জন্য আলাদা আলাদা এজেন্টের পেছনে ছোটার বদলে।",
  },
  para2: {
    en: "The company is a proud Rajshahi University Readers' Forum affiliate, drawing on a licensed staffing and consultancy practice built over years of government and corporate contracts.",
    bn: "প্রতিষ্ঠানটি গর্বের সাথে রাজশাহী বিশ্ববিদ্যালয় রিডার্স ফোরামের সাথে যুক্ত, এবং বছরের পর বছর সরকারি ও কর্পোরেট চুক্তির অভিজ্ঞতার ওপর গড়ে ওঠা একটি লাইসেন্সপ্রাপ্ত স্টাফিং ও পরামর্শ প্র্যাকটিসের ওপর নির্ভর করে।",
  },
  exploreH2: { en: "Explore Our Services", bn: "আমাদের সেবাসমূহ দেখুন" },
  exploreBody: {
    en: "Airport VIP, hotel & car, government requests, manpower & security, and courses & careers.",
    bn: "এয়ারপোর্ট ভিআইপি, হোটেল ও গাড়ি, সরকারি কাজের সহায়তা, জনবল ও নিরাপত্তা এবং কোর্স ও ক্যারিয়ার।",
  },
  viewAllServices: { en: "View All Services", bn: "সকল সেবা দেখুন" },
};

export const contactPageT = {
  eyebrow: { en: "Contact", bn: "যোগাযোগ" },
  h1: { en: "Get in Touch", bn: "যোগাযোগ করুন" },
  intro: {
    en: "Reach our desk directly, or submit a service request and we'll follow up right away.",
    bn: "সরাসরি আমাদের ডেস্কে যোগাযোগ করুন, অথবা একটি সেবার অনুরোধ জমা দিন এবং আমরা দ্রুত যোগাযোগ করব।",
  },
  requestService: { en: "Request a Service", bn: "সেবার জন্য অনুরোধ করুন" },
  fallbackReachDesk: { en: "Reach the desk", bn: "ডেস্কে যোগাযোগ করুন" },
  fallbackFindUs: { en: "Find us", bn: "আমাদের ঠিকানা" },
};

// ---------------------------------------------------------------------
// Per-service-page data, keyed by the same id used in data/servicePages.ts
// ---------------------------------------------------------------------

export const servicePagesT: Record<
  string,
  {
    h1: { en: string; bn: string };
    intro: { en: string; bn: string };
    whoFor: { en: string; bn: string }[];
    included: { en: string; bn: string }[];
    process: { title: { en: string; bn: string }; body: { en: string; bn: string } }[];
    faqs: { question: { en: string; bn: string }; answer: { en: string; bn: string } }[];
    cta: { en: string; bn: string };
  }
> = {
  "airport-vip": {
    h1: {
      en: "Airport VIP Reception & Pickup in Dhaka, Bangladesh",
      bn: "ঢাকা, বাংলাদেশে এয়ারপোর্ট ভিআইপি রিসেপশন ও পিকআপ",
    },
    intro: {
      en: "A meet-and-greet officer at the aircraft door, fast-track immigration support, baggage assistance, and a car already waiting at the curb for your Dhaka airport pickup. Our airport VIP service is built for travellers, families and business visitors who want a smooth, well-coordinated arrival or departure anywhere in Bangladesh.",
      bn: "বিমানের দরজায় একজন মিট-অ্যান্ড-গ্রিট কর্মকর্তা, ফাস্ট-ট্র্যাক ইমিগ্রেশন সহায়তা, লাগেজ সহায়তা এবং আপনার ঢাকা এয়ারপোর্ট পিকআপের জন্য কার্বেই অপেক্ষমান একটি গাড়ি। আমাদের এয়ারপোর্ট ভিআইপি সেবা তৈরি করা হয়েছে ভ্রমণকারী, পরিবার ও ব্যবসায়িক অতিথিদের জন্য, যারা বাংলাদেশের যেকোনো স্থানে একটি মসৃণ, সুসমন্বিত আগমন বা প্রস্থান চান।",
    },
    whoFor: [
      { en: "International visitors arriving in Dhaka, Chattogram or Sylhet", bn: "ঢাকা, চট্টগ্রাম বা সিলেটে আগমনকারী আন্তর্জাতিক অতিথি" },
      { en: "Bangladeshi families welcoming relatives home", bn: "স্বজনদের দেশে স্বাগত জানানো বাংলাদেশি পরিবার" },
      { en: "Business travellers on a tight schedule", bn: "ব্যস্ত সময়সূচির ব্যবসায়িক ভ্রমণকারী" },
      { en: "Overseas Bangladeshis returning for a visit", bn: "সফরে আসা প্রবাসী বাংলাদেশি" },
      { en: "Elderly or first-time travellers who want extra support", bn: "অতিরিক্ত সহায়তা চান এমন প্রবীণ বা প্রথমবার ভ্রমণকারী" },
    ],
    included: [
      { en: "Meet & greet at the aircraft door or terminal entrance", bn: "বিমানের দরজা বা টার্মিনাল প্রবেশপথে মিট অ্যান্ড গ্রিট" },
      { en: "Fast-track immigration and customs coordination", bn: "ফাস্ট-ট্র্যাক ইমিগ্রেশন ও কাস্টমস সমন্বয়" },
      { en: "Baggage assistance, door to door", bn: "দুয়ার থেকে দুয়ার লাগেজ সহায়তা" },
      { en: "Lounge access arranged on request", bn: "অনুরোধ অনুযায়ী লাউঞ্জ প্রবেশাধিকার ব্যবস্থা" },
      { en: "Car staged at the curb for onward travel", bn: "পরবর্তী যাত্রার জন্য কার্বে প্রস্তুত গাড়ি" },
      { en: "Support for both arrivals and departures", bn: "আগমন ও প্রস্থান উভয়ের জন্য সহায়তা" },
    ],
    process: [
      { title: { en: "Choose Airport VIP", bn: "এয়ারপোর্ট ভিআইপি বেছে নিন" }, body: { en: "Select the airport VIP service on our request form.", bn: "আমাদের অনুরোধ ফর্মে এয়ারপোর্ট ভিআইপি সেবা নির্বাচন করুন।" } },
      { title: { en: "Share your flight details", bn: "আপনার ফ্লাইটের তথ্য দিন" }, body: { en: "Tell us your flight number, arrival date and airport.", bn: "আমাদের আপনার ফ্লাইট নম্বর, আগমনের তারিখ ও বিমানবন্দর জানান।" } },
      { title: { en: "We coordinate on the ground", bn: "আমরা মাঠপর্যায়ে সমন্বয় করি" }, body: { en: "Our team arranges the meet & greet and transport in advance.", bn: "আমাদের দল আগে থেকেই মিট অ্যান্ড গ্রিট এবং পরিবহন ব্যবস্থা করে।" } },
      { title: { en: "Arrive with support", bn: "সহায়তাসহ পৌঁছান" }, body: { en: "You're met at the gate and assisted through to your car.", bn: "গেটেই আপনার সাথে দেখা হবে এবং আপনার গাড়ি পর্যন্ত সহায়তা করা হবে।" } },
    ],
    faqs: [
      { question: { en: "Which airports do you cover?", bn: "আপনারা কোন কোন বিমানবন্দর কভার করেন?" }, answer: { en: "We cover Hazrat Shahjalal International (Dhaka), Shah Amanat International (Chattogram) and Osmani International (Sylhet).", bn: "আমরা হযরত শাহজালাল আন্তর্জাতিক (ঢাকা), শাহ আমানত আন্তর্জাতিক (চট্টগ্রাম) এবং ওসমানী আন্তর্জাতিক (সিলেট) কভার করি।" } },
      { question: { en: "Can you arrange airport assistance for elderly travellers?", bn: "প্রবীণ ভ্রমণকারীদের জন্য কি এয়ারপোর্ট সহায়তার ব্যবস্থা করা যায়?" }, answer: { en: "Yes — let us know in your request notes and we'll arrange extra support at the airport.", bn: "হ্যাঁ — আপনার অনুরোধের নোটে জানালে আমরা বিমানবন্দরে অতিরিক্ত সহায়তার ব্যবস্থা করব।" } },
      { question: { en: "Do you also handle departures?", bn: "আপনারা কি প্রস্থানের ক্ষেত্রেও সহায়তা করেন?" }, answer: { en: "Yes. Airport VIP covers both arrival and departure assistance.", bn: "হ্যাঁ। এয়ারপোর্ট ভিআইপি সেবায় আগমন ও প্রস্থান উভয়ের সহায়তা অন্তর্ভুক্ত।" } },
      { question: { en: "How much notice do you need?", bn: "কতদিন আগে জানাতে হবে?" }, answer: { en: "Submit your request as early as possible; for most flights we can confirm arrangements within 24–48 hours.", bn: "যত দ্রুত সম্ভব আপনার অনুরোধ জমা দিন; বেশিরভাগ ফ্লাইটের ক্ষেত্রে আমরা ২৪-৪৮ ঘণ্টার মধ্যে ব্যবস্থা নিশ্চিত করতে পারি।" } },
    ],
    cta: { en: "Request Airport VIP", bn: "এয়ারপোর্ট ভিআইপির জন্য অনুরোধ করুন" },
  },

  "hotel-car": {
    h1: { en: "Hotel & Car Booking Across Bangladesh", bn: "সমগ্র বাংলাদেশে হোটেল ও গাড়ি বুকিং" },
    intro: {
      en: "We shortlist and reserve accommodation and transport against your schedule and budget — not a generic booking-site listing, but a fit checked by someone who knows the ground in Dhaka, Rajshahi and beyond.",
      bn: "আমরা আপনার সময়সূচি ও বাজেট অনুযায়ী থাকার ব্যবস্থা ও পরিবহন বাছাই ও সংরক্ষণ করি — কোনো সাধারণ বুকিং-সাইট তালিকা নয়, বরং ঢাকা, রাজশাহী ও তার বাইরের মাঠ পরিস্থিতি জানা একজনের যাচাই করা উপযুক্ত ব্যবস্থা।",
    },
    whoFor: [
      { en: "Business travellers who need a reliable hotel and vehicle on short notice", bn: "স্বল্প সময়ে নির্ভরযোগ্য হোটেল ও গাড়ি প্রয়োজন এমন ব্যবসায়িক ভ্রমণকারী" },
      { en: "Families visiting Bangladesh who want vetted, comfortable accommodation", bn: "যাচাইকৃত, আরামদায়ক থাকার ব্যবস্থা চান এমন বাংলাদেশ ভ্রমণকারী পরিবার" },
      { en: "International visitors unfamiliar with local hotel and transport options", bn: "স্থানীয় হোটেল ও পরিবহন বিকল্পের সাথে অপরিচিত আন্তর্জাতিক অতিথি" },
      { en: "Organisations booking for staff or delegations", bn: "কর্মী বা প্রতিনিধিদলের জন্য বুকিং করা প্রতিষ্ঠান" },
    ],
    included: [
      { en: "Vetted hotels, from standard to luxury", bn: "স্ট্যান্ডার্ড থেকে লাক্সারি পর্যন্ত যাচাইকৃত হোটেল" },
      { en: "Airport transfers and point-to-point transport", bn: "এয়ারপোর্ট ট্রান্সফার ও পয়েন্ট-টু-পয়েন্ট পরিবহন" },
      { en: "Sedan, SUV or van, with or without driver", bn: "চালকসহ বা চালকবিহীন সেডান, এসইউভি বা ভ্যান" },
      { en: "Itinerary-matched scheduling", bn: "ভ্রমণসূচি অনুযায়ী সময় নির্ধারণ" },
      { en: "One invoice, one point of contact", bn: "একটি চালান, একটি যোগাযোগ কেন্দ্র" },
    ],
    process: [
      { title: { en: "Choose Hotel & Car", bn: "হোটেল ও গাড়ি বেছে নিন" }, body: { en: "Select the hotel & car service on our request form.", bn: "আমাদের অনুরোধ ফর্মে হোটেল ও গাড়ি সেবা নির্বাচন করুন।" } },
      { title: { en: "Tell us your itinerary", bn: "আপনার ভ্রমণসূচি জানান" }, body: { en: "Share your city, dates and vehicle preference.", bn: "আপনার শহর, তারিখ ও গাড়ির পছন্দ জানান।" } },
      { title: { en: "We coordinate the booking", bn: "আমরা বুকিং সমন্বয় করি" }, body: { en: "Our team confirms hotel and transport arrangements.", bn: "আমাদের দল হোটেল ও পরিবহন ব্যবস্থা নিশ্চিত করে।" } },
      { title: { en: "Travel with support", bn: "সহায়তাসহ ভ্রমণ করুন" }, body: { en: "Your car and accommodation are ready when you arrive.", bn: "আপনি পৌঁছানোর সময় আপনার গাড়ি ও থাকার ব্যবস্থা প্রস্তুত থাকবে।" } },
    ],
    faqs: [
      { question: { en: "Which cities do you cover for hotel and car bookings?", bn: "হোটেল ও গাড়ি বুকিংয়ের জন্য আপনারা কোন কোন শহর কভার করেন?" }, answer: { en: "Dhaka, Rajshahi and other major Bangladesh cities on request — tell us your destination.", bn: "ঢাকা, রাজশাহী ও অনুরোধ অনুযায়ী বাংলাদেশের অন্যান্য প্রধান শহর — আমাদের আপনার গন্তব্য জানান।" } },
      { question: { en: "Can I request a chauffeur-driven car only, without a hotel?", bn: "আমি কি শুধু চালকসহ গাড়ি চাইতে পারি, হোটেল ছাড়া?" }, answer: { en: "Yes — hotel and car can be booked separately or together, whichever you need.", bn: "হ্যাঁ — হোটেল ও গাড়ি আলাদা বা একসাথে বুক করা যায়, যেভাবে আপনার প্রয়োজন।" } },
      { question: { en: "Do you handle airport transfers?", bn: "আপনারা কি এয়ারপোর্ট ট্রান্সফার পরিচালনা করেন?" }, answer: { en: "Yes, airport transfers are part of our standard hotel & car service.", bn: "হ্যাঁ, এয়ারপোর্ট ট্রান্সফার আমাদের স্ট্যান্ডার্ড হোটেল ও গাড়ি সেবার অংশ।" } },
    ],
    cta: { en: "Request Hotel & Car", bn: "হোটেল ও গাড়ির জন্য অনুরোধ করুন" },
  },

  "government-request": {
    h1: { en: "Government Request Assistance in Bangladesh", bn: "বাংলাদেশে সরকারি কাজের সহায়তা" },
    intro: {
      en: "Passport, visa, land records, attestation, trade licences — our desk reviews every case individually and carries it through the registry office, so you don't have to stand in the queue yourself.",
      bn: "পাসপোর্ট, ভিসা, ভূমি রেকর্ড, সত্যায়ন, ট্রেড লাইসেন্স — আমাদের ডেস্ক প্রতিটি কেস আলাদাভাবে পর্যালোচনা করে এবং নিবন্ধন অফিসের মধ্য দিয়ে এটি সম্পন্ন করে, যাতে আপনাকে নিজে লাইনে দাঁড়াতে না হয়।",
    },
    whoFor: [
      { en: "Individuals needing passport, visa or NOC support", bn: "পাসপোর্ট, ভিসা বা এনওসি সহায়তা প্রয়োজন এমন ব্যক্তি" },
      { en: "Families handling NID or birth certificate corrections", bn: "এনআইডি বা জন্ম সনদ সংশোধন করছেন এমন পরিবার" },
      { en: "Landowners requiring land registry or mutation support", bn: "ভূমি নিবন্ধন বা মিউটেশন সহায়তা প্রয়োজন এমন জমির মালিক" },
      { en: "Businesses needing trade licence or registration assistance", bn: "ট্রেড লাইসেন্স বা নিবন্ধন সহায়তা প্রয়োজন এমন ব্যবসা" },
      { en: "Overseas Bangladeshis who cannot attend government offices in person", bn: "সরাসরি সরকারি অফিসে যেতে পারেন না এমন প্রবাসী বাংলাদেশি" },
    ],
    included: [
      { en: "Passport application support", bn: "পাসপোর্ট আবেদন সহায়তা" },
      { en: "Visa extension / NOC assistance", bn: "ভিসা মেয়াদ বৃদ্ধি / এনওসি সহায়তা" },
      { en: "NID / birth certificate correction", bn: "এনআইডি / জন্ম সনদ সংশোধন" },
      { en: "Land registry & mutation support", bn: "ভূমি নিবন্ধন ও মিউটেশন সহায়তা" },
      { en: "Document attestation / notarization", bn: "কাগজপত্র সত্যায়ন / নোটারাইজেশন" },
      { en: "Trade licence / business registration support", bn: "ট্রেড লাইসেন্স / ব্যবসা নিবন্ধন সহায়তা" },
      { en: "Direct phone briefing before any work begins", bn: "কাজ শুরুর আগে সরাসরি ফোনে ব্রিফিং" },
    ],
    process: [
      { title: { en: "Choose Government Request", bn: "সরকারি কাজের সহায়তা বেছে নিন" }, body: { en: "Select the government-request service on our form.", bn: "আমাদের ফর্মে সরকারি কাজের সহায়তা সেবা নির্বাচন করুন।" } },
      { title: { en: "Describe your case", bn: "আপনার বিষয়টি বর্ণনা করুন" }, body: { en: "Tell us which service you need and the details of your case.", bn: "আমাদের জানান কোন সেবা প্রয়োজন এবং আপনার বিষয়ের বিস্তারিত।" } },
      { title: { en: "We review & confirm scope", bn: "আমরা পর্যালোচনা করে নিশ্চিত করি" }, body: { en: "Our desk reviews your case and briefs you by phone before work begins.", bn: "আমাদের ডেস্ক আপনার বিষয়টি পর্যালোচনা করে কাজ শুরুর আগে ফোনে আপনাকে জানায়।" } },
      { title: { en: "We coordinate the process", bn: "আমরা প্রক্রিয়াটি সমন্বয় করি" }, body: { en: "Our team carries the case through the relevant government office.", bn: "আমাদের দল সংশ্লিষ্ট সরকারি অফিসের মাধ্যমে বিষয়টি সম্পন্ন করে।" } },
    ],
    faqs: [
      { question: { en: "What government services can you help with?", bn: "আপনারা কোন কোন সরকারি সেবায় সহায়তা করতে পারেন?" }, answer: { en: "Passport applications, visa extensions/NOCs, NID and birth certificate corrections, land registry and mutation, document attestation, and trade licence or business registration.", bn: "পাসপোর্ট আবেদন, ভিসা মেয়াদ বৃদ্ধি/এনওসি, এনআইডি ও জন্ম সনদ সংশোধন, ভূমি নিবন্ধন ও মিউটেশন, কাগজপত্র সত্যায়ন এবং ট্রেড লাইসেন্স বা ব্যবসা নিবন্ধন।" } },
      { question: { en: "Will someone review my case before starting work?", bn: "কাজ শুরুর আগে কি কেউ আমার বিষয়টি পর্যালোচনা করবে?" }, answer: { en: "Yes — our desk reviews every government request individually and confirms scope with you by phone before any work begins.", bn: "হ্যাঁ — আমাদের ডেস্ক প্রতিটি সরকারি অনুরোধ আলাদাভাবে পর্যালোচনা করে এবং কাজ শুরুর আগে ফোনে আপনার সাথে বিষয়টি নিশ্চিত করে।" } },
      { question: { en: "Can you help if I live outside Bangladesh?", bn: "আমি বাংলাদেশের বাইরে থাকলে কি আপনারা সহায়তা করতে পারবেন?" }, answer: { en: "Yes, we regularly assist overseas Bangladeshis who cannot attend government offices in person.", bn: "হ্যাঁ, আমরা নিয়মিতভাবে প্রবাসী বাংলাদেশিদের সহায়তা করি যারা সরাসরি সরকারি অফিসে যেতে পারেন না।" } },
    ],
    cta: { en: "Request Government Assistance", bn: "সরকারি সহায়তার জন্য অনুরোধ করুন" },
  },

  "manpower-security": {
    h1: { en: "Manpower & Security Services for Bangladesh Businesses", bn: "বাংলাদেশের ব্যবসার জন্য জনবল ও নিরাপত্তা সেবা" },
    intro: {
      en: "Trained security personnel and outsourced workforce for organisations, drawing on a licensed staffing and consultancy practice built over years of government and corporate contracts.",
      bn: "প্রশিক্ষিত নিরাপত্তা কর্মী ও আউটসোর্স করা কর্মীবাহিনী প্রতিষ্ঠানের জন্য, বছরের পর বছর সরকারি ও কর্পোরেট চুক্তির অভিজ্ঞতায় গড়ে ওঠা লাইসেন্সপ্রাপ্ত স্টাফিং ও পরামর্শ প্র্যাকটিসের ভিত্তিতে।",
    },
    whoFor: [
      { en: "Businesses needing outsourced or temporary staffing", bn: "আউটসোর্স বা সাময়িক স্টাফিং প্রয়োজন এমন ব্যবসা" },
      { en: "Organisations requiring trained security personnel", bn: "প্রশিক্ষিত নিরাপত্তা কর্মী প্রয়োজন এমন প্রতিষ্ঠান" },
      { en: "Institutions with recurring workforce or compliance needs", bn: "নিয়মিত কর্মীবাহিনী বা কমপ্লায়েন্স প্রয়োজন এমন প্রতিষ্ঠান" },
      { en: "Companies preparing documentation for staffing contracts", bn: "স্টাফিং চুক্তির জন্য কাগজপত্র প্রস্তুত করছে এমন কোম্পানি" },
    ],
    included: [
      { en: "Licensed staffing & security personnel", bn: "লাইসেন্সপ্রাপ্ত স্টাফিং ও নিরাপত্তা কর্মী" },
      { en: "Corporate & institutional contracts", bn: "কর্পোরেট ও প্রাতিষ্ঠানিক চুক্তি" },
      { en: "Documentation and compliance handled", bn: "কাগজপত্র ও কমপ্লায়েন্স পরিচালনা" },
      { en: "Gulf & overseas placement support for workforce needs", bn: "কর্মীবাহিনীর প্রয়োজনে গালফ ও প্রবাসী প্লেসমেন্ট সহায়তা" },
    ],
    process: [
      { title: { en: "Choose Manpower & Security", bn: "জনবল ও নিরাপত্তা বেছে নিন" }, body: { en: "Tell us about your staffing or security requirement.", bn: "আপনার স্টাফিং বা নিরাপত্তার প্রয়োজন আমাদের জানান।" } },
      { title: { en: "Share your requirement", bn: "আপনার প্রয়োজন জানান" }, body: { en: "Describe the roles, numbers and location needed.", bn: "প্রয়োজনীয় পদ, সংখ্যা ও স্থান বর্ণনা করুন।" } },
      { title: { en: "We coordinate placement", bn: "আমরা প্লেসমেন্ট সমন্বয় করি" }, body: { en: "Our team matches and coordinates suitable personnel.", bn: "আমাদের দল উপযুক্ত কর্মী মিলিয়ে সমন্বয় করে।" } },
      { title: { en: "Ongoing support", bn: "চলমান সহায়তা" }, body: { en: "We remain your point of contact for the engagement.", bn: "সম্পূর্ণ সময়ে আমরা আপনার যোগাযোগ কেন্দ্র থাকি।" } },
    ],
    faqs: [
      { question: { en: "Do you provide security personnel for events or offices?", bn: "আপনারা কি ইভেন্ট বা অফিসের জন্য নিরাপত্তা কর্মী প্রদান করেন?" }, answer: { en: "Yes, we supply trained security personnel for both short-term and ongoing engagements.", bn: "হ্যাঁ, আমরা স্বল্পমেয়াদি ও চলমান উভয় কাজের জন্য প্রশিক্ষিত নিরাপত্তা কর্মী সরবরাহ করি।" } },
      { question: { en: "Can you supply outsourced staff for a business?", bn: "আপনারা কি একটি ব্যবসার জন্য আউটসোর্স করা কর্মী সরবরাহ করতে পারেন?" }, answer: { en: "Yes, we support corporate and institutional staffing contracts across Bangladesh.", bn: "হ্যাঁ, আমরা সারা বাংলাদেশে কর্পোরেট ও প্রাতিষ্ঠানিক স্টাফিং চুক্তিতে সহায়তা করি।" } },
    ],
    cta: { en: "Request Manpower & Security", bn: "জনবল ও নিরাপত্তার জন্য অনুরোধ করুন" },
  },

  "courses-careers": {
    h1: { en: "Courses & Careers", bn: "কোর্স ও ক্যারিয়ার" },
    intro: {
      en: "Beyond logistics — the training and placement work HR — The Mediator is known for. Two clear tracks: professional media and public-speaking training, and international careers support for studying or working in the Gulf.",
      bn: "লজিস্টিকসের বাইরেও — যে প্রশিক্ষণ ও প্লেসমেন্ট কাজের জন্য এইচআর দ্য মিডিয়েটর পরিচিত। দুটি স্পষ্ট ট্র্যাক: পেশাদার মিডিয়া ও পাবলিক স্পিকিং প্রশিক্ষণ, এবং গালফে পড়াশোনা বা কাজের জন্য আন্তর্জাতিক ক্যারিয়ার সহায়তা।",
    },
    whoFor: [
      { en: "Students preparing for media, presentation or public-speaking careers", bn: "মিডিয়া, উপস্থাপনা বা পাবলিক স্পিকিং ক্যারিয়ারের জন্য প্রস্তুতি নিচ্ছেন এমন শিক্ষার্থী" },
      { en: "Professionals wanting stronger communication and presentation skills", bn: "আরও ভালো যোগাযোগ ও উপস্থাপনা দক্ষতা চান এমন পেশাজীবী" },
      { en: "Students exploring university study abroad, including the Gulf", bn: "গালফসহ বিদেশে বিশ্ববিদ্যালয়ে পড়াশোনার সন্ধানে থাকা শিক্ষার্থী" },
      { en: "Jobseekers looking for Gulf employment opportunities", bn: "গালফ কর্মসংস্থানের সুযোগ খুঁজছেন এমন চাকরিপ্রার্থী" },
    ],
    included: [
      { en: "Media & Public Speaking Academy — presentation, communication and confidence training", bn: "মিডিয়া ও পাবলিক স্পিকিং একাডেমি — উপস্থাপনা, যোগাযোগ ও আত্মবিশ্বাস প্রশিক্ষণ" },
      { en: "International Careers — study-abroad guidance and Gulf employment support", bn: "আন্তর্জাতিক ক্যারিয়ার — বিদেশে পড়াশোনার দিকনির্দেশনা ও গালফ কর্মসংস্থান সহায়তা" },
      { en: "Visa and documentation assistance for placements", bn: "প্লেসমেন্টের জন্য ভিসা ও কাগজপত্র সহায়তা" },
      { en: "Pre-departure assistance for students and workers", bn: "শিক্ষার্থী ও কর্মীদের জন্য প্রস্থান-পূর্ব সহায়তা" },
    ],
    process: [
      { title: { en: "Choose your track", bn: "আপনার ট্র্যাক বেছে নিন" }, body: { en: "Media & Public Speaking, or International Careers.", bn: "মিডিয়া ও পাবলিক স্পিকিং, অথবা আন্তর্জাতিক ক্যারিয়ার।" } },
      { title: { en: "Submit your request", bn: "আপনার অনুরোধ জমা দিন" }, body: { en: "Tell us your background and what you're aiming for.", bn: "আপনার পটভূমি ও লক্ষ্য আমাদের জানান।" } },
      { title: { en: "We coordinate the right support", bn: "আমরা উপযুক্ত সহায়তা সমন্বয় করি" }, body: { en: "Our team matches you with the right programme or placement path.", bn: "আমাদের দল আপনাকে উপযুক্ত প্রোগ্রাম বা প্লেসমেন্ট পথের সাথে মিলিয়ে দেয়।" } },
      { title: { en: "Get assistance start to finish", bn: "শুরু থেকে শেষ পর্যন্ত সহায়তা পান" }, body: { en: "From enrolment or placement through to documentation.", bn: "ভর্তি বা প্লেসমেন্ট থেকে শুরু করে কাগজপত্র পর্যন্ত।" } },
    ],
    faqs: [
      { question: { en: "What is the Media & Public Speaking Academy?", bn: "মিডিয়া ও পাবলিক স্পিকিং একাডেমি কী?" }, answer: { en: "Training designed to improve public speaking, communication, presentation skills, media skills and professional confidence.", bn: "পাবলিক স্পিকিং, যোগাযোগ, উপস্থাপনা দক্ষতা, মিডিয়া দক্ষতা ও পেশাদার আত্মবিশ্বাস উন্নত করতে ডিজাইন করা প্রশিক্ষণ।" } },
      { question: { en: "What does International Careers cover?", bn: "আন্তর্জাতিক ক্যারিয়ারে কী কী অন্তর্ভুক্ত?" }, answer: { en: "Overseas university admission, study-abroad guidance, Gulf employment opportunities, career placement, and visa/documentation and pre-departure support.", bn: "বিদেশে বিশ্ববিদ্যালয় ভর্তি, বিদেশে পড়াশোনার দিকনির্দেশনা, গালফ কর্মসংস্থানের সুযোগ, ক্যারিয়ার প্লেসমেন্ট এবং ভিসা/কাগজপত্র ও প্রস্থান-পূর্ব সহায়তা।" } },
    ],
    cta: { en: "Explore Courses & Careers", bn: "কোর্স ও ক্যারিয়ার দেখুন" },
  },

  "media-public-speaking": {
    h1: { en: "Media & Public Speaking Academy", bn: "মিডিয়া ও পাবলিক স্পিকিং একাডেমি" },
    intro: {
      en: "Learn presentation skills from someone who does it on air. News & event hosting, correct pronunciation, radio announcing, reporting, language and public speaking, and soft-skills development — taught by a working national news presenter.",
      bn: "যিনি নিজে সরাসরি সম্প্রচারে করেন, তার কাছ থেকে উপস্থাপনা দক্ষতা শিখুন। সংবাদ ও ইভেন্ট হোস্টিং, সঠিক উচ্চারণ, রেডিও ঘোষণা, রিপোর্টিং, ভাষা ও পাবলিক স্পিকিং এবং সফট-স্কিলস উন্নয়ন — শেখাচ্ছেন একজন কর্মরত জাতীয় সংবাদ উপস্থাপক।",
    },
    whoFor: [
      { en: "Students who want to improve public speaking and confidence", bn: "পাবলিক স্পিকিং ও আত্মবিশ্বাস উন্নত করতে চান এমন শিক্ষার্থী" },
      { en: "Aspiring news presenters and media professionals", bn: "উচ্চাকাঙ্ক্ষী সংবাদ উপস্থাপক ও মিডিয়া পেশাজীবী" },
      { en: "Professionals preparing for presentations or public roles", bn: "উপস্থাপনা বা জনসম্মুখীন ভূমিকার জন্য প্রস্তুতি নিচ্ছেন এমন পেশাজীবী" },
      { en: "Anyone wanting stronger communication skills", bn: "আরও ভালো যোগাযোগ দক্ষতা চান এমন যে কেউ" },
    ],
    included: [
      { en: "Public speaking and presentation training", bn: "পাবলিক স্পিকিং ও উপস্থাপনা প্রশিক্ষণ" },
      { en: "Communication and pronunciation coaching", bn: "যোগাযোগ ও উচ্চারণ কোচিং" },
      { en: "News & event hosting practice", bn: "সংবাদ ও ইভেন্ট হোস্টিং অনুশীলন" },
      { en: "Radio announcing and reporting fundamentals", bn: "রেডিও ঘোষণা ও রিপোর্টিংয়ের মূল বিষয়" },
      { en: "Professional confidence and soft-skills development", bn: "পেশাদার আত্মবিশ্বাস ও সফট-স্কিলস উন্নয়ন" },
    ],
    process: [
      { title: { en: "Choose Media & Public Speaking", bn: "মিডিয়া ও পাবলিক স্পিকিং বেছে নিন" }, body: { en: "Select this programme on our request form.", bn: "আমাদের অনুরোধ ফর্মে এই প্রোগ্রামটি নির্বাচন করুন।" } },
      { title: { en: "Tell us your background", bn: "আপনার পটভূমি জানান" }, body: { en: "Share your current education or occupation and goals.", bn: "আপনার বর্তমান শিক্ষা বা পেশা এবং লক্ষ্য জানান।" } },
      { title: { en: "We confirm your batch", bn: "আমরা আপনার ব্যাচ নিশ্চিত করি" }, body: { en: "Offline (Bangladesh campus) or online (Zoom) batches available.", bn: "অফলাইন (বাংলাদেশ ক্যাম্পাস) বা অনলাইন (জুম) ব্যাচ উপলব্ধ।" } },
      { title: { en: "Begin training", bn: "প্রশিক্ষণ শুরু করুন" }, body: { en: "Start the academy with ongoing support from our team.", bn: "আমাদের দলের চলমান সহায়তা নিয়ে একাডেমি শুরু করুন।" } },
    ],
    faqs: [
      { question: { en: "Who teaches the Media & Public Speaking Academy?", bn: "মিডিয়া ও পাবলিক স্পিকিং একাডেমি কে পড়ান?" }, answer: { en: "Our lead trainer is a working national news presenter with on-air experience.", bn: "আমাদের প্রধান প্রশিক্ষক সরাসরি সম্প্রচারের অভিজ্ঞতাসম্পন্ন একজন কর্মরত জাতীয় সংবাদ উপস্থাপক।" } },
      { question: { en: "Is the course offered online?", bn: "কোর্সটি কি অনলাইনে দেওয়া হয়?" }, answer: { en: "Yes, both an offline Bangladesh-campus batch and an online Zoom batch are available.", bn: "হ্যাঁ, অফলাইন বাংলাদেশ-ক্যাম্পাস ব্যাচ এবং অনলাইন জুম ব্যাচ উভয়ই উপলব্ধ।" } },
    ],
    cta: { en: "Explore the Academy", bn: "একাডেমি দেখুন" },
  },

  "study-work-gulf": {
    h1: {
      en: "Gulf & Middle East Jobs and Study Abroad — International Careers",
      bn: "গালফ ও মধ্যপ্রাচ্যে চাকরি এবং বিদেশে পড়াশোনা — আন্তর্জাতিক ক্যারিয়ার",
    },
    intro: {
      en: "Verified placement, not a broker's promise. Manpower export and recruitment support for jobs in the UAE, Qatar, Saudi Arabia and the wider Gulf and Middle East, plus study-abroad guidance for students from Dhaka, Rajshahi and across Bangladesh, drawing on our licensed staffing and outsourcing practice.",
      bn: "যাচাইকৃত প্লেসমেন্ট, কোনো দালালের প্রতিশ্রুতি নয়। ইউএই, কাতার, সৌদি আরব ও বিস্তৃত গালফ এবং মধ্যপ্রাচ্যে চাকরির জন্য জনশক্তি রপ্তানি ও নিয়োগ সহায়তা, পাশাপাশি ঢাকা, রাজশাহী ও সমগ্র বাংলাদেশের শিক্ষার্থীদের জন্য বিদেশে পড়াশোনার দিকনির্দেশনা, আমাদের লাইসেন্সপ্রাপ্ত স্টাফিং ও আউটসোর্সিং প্র্যাকটিসের অভিজ্ঞতায়।",
    },
    whoFor: [
      { en: "Students seeking university admission or study-abroad guidance", bn: "বিশ্ববিদ্যালয় ভর্তি বা বিদেশে পড়াশোনার দিকনির্দেশনা খুঁজছেন এমন শিক্ষার্থী" },
      { en: "Jobseekers pursuing Gulf employment opportunities", bn: "গালফ কর্মসংস্থানের সুযোগ খুঁজছেন এমন চাকরিপ্রার্থী" },
      { en: "Overseas Bangladeshis planning a move to the Gulf", bn: "গালফে যাওয়ার পরিকল্পনা করছেন এমন প্রবাসী বাংলাদেশি" },
      { en: "Families needing pre-departure and documentation support", bn: "প্রস্থান-পূর্ব ও কাগজপত্র সহায়তা প্রয়োজন এমন পরিবার" },
    ],
    included: [
      { en: "Overseas university admission support", bn: "বিদেশে বিশ্ববিদ্যালয় ভর্তি সহায়তা" },
      { en: "Study-abroad guidance", bn: "বিদেশে পড়াশোনার দিকনির্দেশনা" },
      { en: "Gulf employment opportunities and career placement", bn: "গালফ কর্মসংস্থানের সুযোগ ও ক্যারিয়ার প্লেসমেন্ট" },
      { en: "Visa and documentation support", bn: "ভিসা ও কাগজপত্র সহায়তা" },
      { en: "Pre-departure assistance", bn: "প্রস্থান-পূর্ব সহায়তা" },
    ],
    process: [
      { title: { en: "Choose International Careers", bn: "আন্তর্জাতিক ক্যারিয়ার বেছে নিন" }, body: { en: "Select this programme on our request form.", bn: "আমাদের অনুরোধ ফর্মে এই প্রোগ্রামটি নির্বাচন করুন।" } },
      { title: { en: "Share your goals", bn: "আপনার লক্ষ্য জানান" }, body: { en: "Study or work, target country, and your current background.", bn: "পড়াশোনা বা কাজ, লক্ষ্য দেশ এবং আপনার বর্তমান পটভূমি।" } },
      { title: { en: "We coordinate placement", bn: "আমরা প্লেসমেন্ট সমন্বয় করি" }, body: { en: "Our team matches you with a suitable university or employment path.", bn: "আমাদের দল আপনাকে উপযুক্ত বিশ্ববিদ্যালয় বা কর্মসংস্থানের পথের সাথে মিলিয়ে দেয়।" } },
      { title: { en: "Pre-departure support", bn: "প্রস্থান-পূর্ব সহায়তা" }, body: { en: "Documentation and visa assistance ahead of travel.", bn: "ভ্রমণের আগে কাগজপত্র ও ভিসা সহায়তা।" } },
    ],
    faqs: [
      { question: { en: "Which Gulf countries do you support placement for?", bn: "আপনারা কোন কোন গালফ দেশে প্লেসমেন্ট সহায়তা দেন?" }, answer: { en: "The UAE, Qatar, Saudi Arabia, and wider Gulf markets.", bn: "ইউএই, কাতার, সৌদি আরব এবং বিস্তৃত গালফ বাজার।" } },
      { question: { en: "Do you help with visa and documentation?", bn: "আপনারা কি ভিসা ও কাগজপত্রে সহায়তা করেন?" }, answer: { en: "Yes, visa and documentation support plus pre-departure assistance are included.", bn: "হ্যাঁ, ভিসা ও কাগজপত্র সহায়তা এবং প্রস্থান-পূর্ব সহায়তা অন্তর্ভুক্ত।" } },
    ],
    cta: { en: "Explore International Careers", bn: "আন্তর্জাতিক ক্যারিয়ার দেখুন" },
  },
};

// navLabel per service-page id (data/servicePages.ts) — used for the small
// eyebrow tag, the "<X> FAQs" heading, and cross-links between service pages.
export const serviceNavLabelsT: Record<string, { en: string; bn: string }> = {
  "airport-vip": { en: "Airport VIP", bn: "এয়ারপোর্ট ভিআইপি" },
  "hotel-car": { en: "Hotel & Car", bn: "হোটেল ও গাড়ি" },
  "government-request": { en: "Government Request", bn: "সরকারি কাজের সহায়তা" },
  "manpower-security": { en: "Manpower & Security", bn: "জনবল ও নিরাপত্তা" },
  "courses-careers": { en: "Courses & Careers", bn: "কোর্স ও ক্যারিয়ার" },
  "media-public-speaking": { en: "Media & Public Speaking Academy", bn: "মিডিয়া ও পাবলিক স্পিকিং একাডেমি" },
  "study-work-gulf": {
    en: "International Careers — Study & Work in the Gulf",
    bn: "আন্তর্জাতিক ক্যারিয়ার — গালফে পড়াশোনা ও কাজ",
  },
};

// GOV_SERVICES / PURPOSES / PROGRAMS select-option lists from lib/constants.ts
export const govServicesT = [
  { en: "Passport application support", bn: "পাসপোর্ট আবেদন সহায়তা" },
  { en: "Visa extension / NOC", bn: "ভিসা মেয়াদ বৃদ্ধি / এনওসি" },
  { en: "NID / birth certificate correction", bn: "এনআইডি / জন্ম সনদ সংশোধন" },
  { en: "Land registry & mutation support", bn: "ভূমি নিবন্ধন ও মিউটেশন সহায়তা" },
  { en: "Document attestation / notarization", bn: "কাগজপত্র সত্যায়ন / নোটারাইজেশন" },
  { en: "Trade license / business registration", bn: "ট্রেড লাইসেন্স / ব্যবসা নিবন্ধন" },
  { en: "Other government liaison", bn: "অন্যান্য সরকারি সমন্বয়" },
];

export const purposesT = [
  { en: "Business", bn: "ব্যবসা" },
  { en: "Tourism", bn: "পর্যটন" },
  { en: "Family visit", bn: "পারিবারিক সফর" },
  { en: "Diaspora / expatriate return", bn: "প্রবাসী প্রত্যাবর্তন" },
  { en: "Study", bn: "পড়াশোনা" },
  { en: "Medical", bn: "চিকিৎসা" },
  { en: "Government / diplomatic", bn: "সরকারি / কূটনৈতিক" },
  { en: "Other", bn: "অন্যান্য" },
];

export const programsT = [
  { id: "study", en: "Study Abroad Consultation", bn: "বিদেশে পড়াশোনা পরামর্শ" },
  { id: "media", en: "Media & Public Speaking Academy", bn: "মিডিয়া ও পাবলিক স্পিকিং একাডেমি" },
  { id: "gulf", en: "Gulf & Overseas Employment", bn: "গালফ ও প্রবাসী কর্মসংস্থান" },
];
