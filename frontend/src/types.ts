export type RequestStatus = "received" | "approved" | "rejected" | "paid";

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
  rejectionReason: string | null;
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
