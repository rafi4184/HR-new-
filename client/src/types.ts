export type RequestStatus = "received" | "approved" | "rejected" | "paid" | "completed";

export interface ServiceRequest {
  id: number;
  ticket: string;
  type: string;
  summary: string;
  name: string;
  dob: string;
  phone: string;
  email: string;
  status: RequestStatus;
  fee: number | null;
  serviceLabel: string | null;
  paymentMethod: string | null;
  decisionNote: string | null;
  notifiedAt: string | null;
  completedAt: string | null;
  details: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IdentityFields {
  name: string;
  dob: string;
  phone: string;
  email: string;
}

export type BookingTab = "airport" | "hotel" | "government" | "programs";

export interface Contact {
  id: number;
  label: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  whatsapp: string | null;
  sortOrder: number;
}

export interface EventMedia {
  id: number;
  mediaType: "image" | "video";
  storagePath: string;
  url: string;
}

export interface EventItem {
  id: number;
  title: string;
  description: string | null;
  eventDate: string | null;
  location: string | null;
  media: EventMedia[];
}

export interface StaffMember {
  userId: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface WhoAmI {
  userId: string;
  email: string;
  isAdmin: boolean;
}
