export type RequestStatus = "received" | "approved" | "rejected" | "paid" | "completed";
export type RequestType = "airport" | "hotel" | "government" | "program";

export interface Contact {
  id: number;
  label: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  whatsapp: string | null;
}

export interface EventMedia {
  id: number;
  mediaType: "image" | "video";
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

export interface TrackedRequest {
  ticket: string;
  typeLabel: string;
  summary: string;
  status: RequestStatus;
  fee: number | null;
  decisionNote: string | null;
  createdAt: string;
  updatedAt: string;
}
