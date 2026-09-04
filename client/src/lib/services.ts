import { PlaneTakeoff, CarFront, Landmark, ShieldCheck, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { BookingTab } from "../types";

export interface ServiceSummary {
  id: string;
  path: string;
  title: string;
  shortTitle: string;
  navLabel: string;
  summary: string;
  icon: LucideIcon;
  cta: string;
  bookTab: BookingTab | null;
}

export const SERVICES: ServiceSummary[] = [
  {
    id: "airport",
    path: "/airport-vip",
    title: "Airport VIP Reception",
    shortTitle: "Airport VIP",
    navLabel: "Airport VIP",
    summary:
      "Premium airport meet & greet, arrival assistance, departure assistance and passenger support.",
    icon: PlaneTakeoff,
    cta: "Explore Airport VIP",
    bookTab: "airport",
  },
  {
    id: "hotel",
    path: "/hotel-car",
    title: "Hotel & Car Booking",
    shortTitle: "Hotel & Car",
    navLabel: "Hotel & Car",
    summary: "Hotel arrangements, airport transfers, chauffeur and transportation support.",
    icon: CarFront,
    cta: "Explore Hotel & Car",
    bookTab: "hotel",
  },
  {
    id: "government",
    path: "/government-request",
    title: "Government Request",
    shortTitle: "Government Request",
    navLabel: "Government Request",
    summary: "Assistance with government-related requests, documentation and administrative processes.",
    icon: Landmark,
    cta: "Explore Government Services",
    bookTab: "government",
  },
  {
    id: "manpower",
    path: "/manpower-security",
    title: "Manpower & Security",
    shortTitle: "Manpower & Security",
    navLabel: "Manpower & Security",
    summary: "Professional manpower, staffing and security solutions for businesses and organisations.",
    icon: ShieldCheck,
    cta: "Explore Manpower & Security",
    bookTab: null,
  },
  {
    id: "courses",
    path: "/courses-careers",
    title: "Courses & Careers",
    shortTitle: "Courses & Careers",
    navLabel: "Courses & Careers",
    summary: "Professional training, media and public speaking, international education and Gulf career support.",
    icon: GraduationCap,
    cta: "Explore Courses & Careers",
    bookTab: "programs",
  },
];

export function getService(id: string): ServiceSummary | undefined {
  return SERVICES.find((s) => s.id === id);
}
