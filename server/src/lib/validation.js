import { z } from "zod";

const identity = {
  name: z.string().trim().min(1, "Full name is required"),
  dob: z.string().trim().min(1, "Date of birth is required"),
  phone: z.string().trim().min(1, "Phone number is required"),
  email: z.string().trim().email("Enter a valid email address"),
};

export const PROGRAMS = [
  { id: "study", label: "Study Abroad Consultation" },
  { id: "media", label: "Media & Public Speaking Academy" },
  { id: "gulf", label: "Gulf & Overseas Employment" },
];

export const GOV_SERVICES = [
  "Passport application support",
  "Visa extension / NOC",
  "NID / birth certificate correction",
  "Land registry & mutation support",
  "Document attestation / notarization",
  "Trade license / business registration",
  "Other government liaison",
];

export const requestSchemas = {
  airport: z.object({
    ...identity,
    flight: z.string().trim().min(1, "Flight number is required"),
    airport: z.string().trim().min(1),
    date: z.string().trim().min(1, "Arrival date is required"),
    time: z.string().trim().optional().default(""),
    purpose: z.string().trim().min(1),
    travelers: z.coerce.number().int().min(1).default(1),
    notes: z.string().trim().optional().default(""),
  }),
  hotel: z.object({
    ...identity,
    city: z.string().trim().min(1, "City is required"),
    tier: z.string().trim().optional().default("Standard"),
    checkin: z.string().trim().min(1, "Check-in date is required"),
    checkout: z.string().trim().min(1, "Check-out date is required"),
    car: z.string().trim().optional().default(""),
    pickup: z.string().trim().optional().default(""),
    notes: z.string().trim().optional().default(""),
  }),
  government: z.object({
    ...identity,
    service: z.string().trim().min(1, "Select a service"),
    urgency: z.string().trim().optional().default("Standard"),
    description: z.string().trim().min(1, "Describe the issue"),
  }),
  program: z.object({
    ...identity,
    program: z.enum(["study", "media", "gulf"]),
    batch: z.string().trim().optional().default(""),
    background: z.string().trim().optional().default(""),
    notes: z.string().trim().optional().default(""),
  }),
};

export function summaryFor(type, fields) {
  switch (type) {
    case "airport":
      return `${fields.flight} arriving ${fields.date}`;
    case "hotel":
      return `${fields.city}, ${fields.checkin} → ${fields.checkout}`;
    case "government":
      return fields.service;
    case "program":
      return PROGRAMS.find((p) => p.id === fields.program)?.label ?? fields.program;
    default:
      return "";
  }
}

export const typeLabels = {
  airport: "Airport VIP",
  hotel: "Hotel & Car",
  government: "Government Request",
  program: "Program Enrollment",
};
