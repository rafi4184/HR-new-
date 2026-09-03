import type { BookingTab } from "../types";

// Single source of truth for the four-service cinematic experience (hero,
// nav, service selector). Swap `video` for a real file under
// /public/videos/ whenever footage exists — every consumer already treats
// video as optional and falls back to the Ken Burns `images` crossfade.
export interface ServiceDef {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  benefits: string[];
  video?: string;
  poster: string;
  images: string[];
  bookTab: BookingTab | null;
  accent: string;
}

export const SERVICES: ServiceDef[] = [
  {
    id: "airport",
    number: "01",
    title: "Airport VIP Reception",
    shortTitle: "Airport VIP",
    tagline: "Touchdown to terminal exit, without the queue.",
    description:
      "A meet-and-greet officer at the aircraft door, fast-track immigration, baggage handled, lounge access arranged, and a car already waiting at the curb.",
    benefits: [
      "Fast-track immigration & customs",
      "Baggage assistance, door to door",
      "Lounge access on request",
      "Car staged at the curb on arrival",
    ],
    video: "/videos/airport-vip.mp4",
    poster: "/images/hasanur-rahman.jpg",
    images: [
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1800&q=80&auto=format&fit=crop",
    ],
    bookTab: "airport",
    accent: "#A6402A",
  },
  {
    id: "hotel",
    number: "02",
    title: "Hotel & Car Booking",
    shortTitle: "Hotel & Car",
    tagline: "The stay and the vehicle, matched to the itinerary.",
    description:
      "We shortlist and reserve accommodation and transport against your schedule and budget — not a generic booking-site listing, a fit checked by someone who knows the ground.",
    benefits: [
      "Vetted hotels, standard to luxury",
      "Sedan, SUV or van, with or without driver",
      "Itinerary-matched scheduling",
      "One invoice, one point of contact",
    ],
    video: "/videos/hotel-booking.mp4",
    poster:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1800&q=80&auto=format&fit=crop",
    ],
    bookTab: "hotel",
    accent: "#A6402A",
  },
  {
    id: "government",
    number: "03",
    title: "Government Liaison",
    shortTitle: "Government",
    tagline: "Someone stands in the queue on your behalf.",
    description:
      "Passport, visa, land records, attestation, trade licences — our desk reviews every case individually and carries it through the registry office so you don't have to.",
    benefits: [
      "Passport, visa & NOC support",
      "Land registry & mutation",
      "Document attestation & notarization",
      "Direct phone briefing before work begins",
    ],
    video: "/videos/government-liaison.mp4",
    poster:
      "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1800&q=80&auto=format&fit=crop",
    ],
    bookTab: "government",
    accent: "#A6402A",
  },
  {
    id: "manpower",
    number: "04",
    title: "Manpower & Security",
    shortTitle: "Manpower & Security",
    tagline: "Our core practice — staffing an operation can trust.",
    description:
      "Trained security personnel and outsourced workforce for organizations, drawing on a licensed staffing and consultancy practice built over years of government and corporate contracts.",
    benefits: [
      "Licensed staffing & security personnel",
      "Corporate & institutional contracts",
      "Documentation and compliance handled",
      "Gulf & overseas placement support",
    ],
    video: "/videos/manpower-security.mp4",
    poster:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1800&q=80&auto=format&fit=crop",
    ],
    bookTab: null,
    accent: "#A6402A",
  },
];
