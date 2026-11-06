import { Home, KeyRound, Search } from "lucide-react";
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
    id: "property-sales",
    path: "/property-sales",
    title: "Real Estate Sales",
    shortTitle: "Sales",
    navLabel: "Sell / Appraisal",
    summary: "Appraisals, marketing and negotiation for sellers, from first enquiry through to settlement.",
    icon: Home,
    cta: "Get a Property Appraisal",
    bookTab: "sales",
  },
  {
    id: "property-management",
    path: "/property-management",
    title: "Property Management",
    shortTitle: "Property Management",
    navLabel: "Property Management",
    summary: "End-to-end rental management for landlords — tenant placement, rent collection, inspections and maintenance.",
    icon: KeyRound,
    cta: "Get a Property Management Quote",
    bookTab: "management",
  },
  {
    id: "buyers-agency",
    path: "/buyers-agency",
    title: "Buyer's Agency",
    shortTitle: "Buyer's Agency",
    navLabel: "Buyer's Agency",
    summary: "Independent representation for buyers and investors — search, due diligence and negotiation, on your side.",
    icon: Search,
    cta: "Start Your Buyer's Brief",
    bookTab: "buyers",
  },
];

export function getService(id: string): ServiceSummary | undefined {
  return SERVICES.find((s) => s.id === id);
}
