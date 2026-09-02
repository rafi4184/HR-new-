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
