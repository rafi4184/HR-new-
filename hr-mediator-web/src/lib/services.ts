import type { RequestType } from "./types";

export interface Service {
  id: string;
  title: string;
  summary: string;
  points: string[];
  requestType: RequestType | null;
}

export const SERVICES: Service[] = [
  {
    id: "airport",
    title: "Airport VIP Reception",
    summary: "Meet & greet, arrival and departure assistance, and passenger support at Bangladesh's international airports.",
    points: ["Dhaka, Chattogram & Sylhet", "Fast-track coordination", "Family & group arrivals"],
    requestType: "airport",
  },
  {
    id: "hotel",
    title: "Hotel & Car Booking",
    summary: "Hotel arrangements, airport transfers, chauffeur-driven cars and on-trip transport.",
    points: ["Standard to luxury hotels", "Sedan, SUV or van with driver", "Airport pickup"],
    requestType: "hotel",
  },
  {
    id: "government",
    title: "Government Requests",
    summary: "Help with passports, visas, NID corrections, land records, attestation and business registration.",
    points: ["Case reviewed individually", "Scope confirmed by phone", "Track progress online"],
    requestType: "government",
  },
  {
    id: "programs",
    title: "Courses & Careers",
    summary: "Study abroad consultation, media & public speaking training, and Gulf & overseas employment support.",
    points: ["Study in Europe & beyond", "Media academy batches", "Gulf placement guidance"],
    requestType: "program",
  },
  {
    id: "manpower",
    title: "Manpower & Security",
    summary: "Professional staffing and security solutions for businesses and organisations.",
    points: ["Vetted personnel", "Event & corporate security", "Contact us for a quote"],
    requestType: null,
  },
];

export const AIRPORTS = ["Hazrat Shahjalal Int'l, Dhaka", "Shah Amanat Int'l, Chattogram", "Osmani Int'l, Sylhet"];
export const PURPOSES = ["Business", "Tourism", "Family visit", "Diaspora / expatriate return", "Study", "Medical", "Government / diplomatic", "Other"];
export const HOTEL_TIERS = ["Standard", "Business", "Luxury"];
export const CAR_OPTIONS = ["Sedan, self-drive", "Sedan, with driver", "SUV, with driver", "Van, with driver", "No car needed"];
export const GOV_SERVICES = [
  "Passport application support",
  "Visa extension / NOC",
  "NID / birth certificate correction",
  "Land registry & mutation support",
  "Document attestation / notarization",
  "Trade license / business registration",
  "Other government liaison",
];
export const PROGRAMS = [
  { id: "study", label: "Study Abroad Consultation" },
  { id: "media", label: "Media & Public Speaking Academy" },
  { id: "gulf", label: "Gulf & Overseas Employment" },
];
export const BATCHES = ["Offline, Bangladesh campus", "Online, Zoom", "Not applicable"];
