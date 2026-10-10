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
  internalNotes: string | null;
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

export type BookingTab = "airport" | "hotel" | "government" | "programs" | "resume";

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

export type StaffRole = "admin" | "executive" | "staff";

export interface StaffMember {
  userId: string;
  staffId: string;
  isAdmin: boolean;
  role: StaffRole;
  managerId: string | null;
  managerStaffId: string | null;
  createdAt: string;
}

export interface TeamMember {
  userId: string;
  staffId: string;
  createdAt: string;
}

export interface WhoAmI {
  userId: string;
  email: string;
  isAdmin: boolean;
  role: StaffRole;
  managerId: string | null;
  staffId: string | null;
}

export interface AuditLogEntry {
  id: number;
  actorStaffId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export type ResumeStatus = "new" | "reviewed" | "contacted" | "shortlisted" | "not_suitable";

export interface ResumeSubmission {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  targetRole: string | null;
  targetCountry: string | null;
  note: string | null;
  fileName: string;
  storagePath: string;
  status: ResumeStatus;
  reviewerNote: string | null;
  reviewedAt: string | null;
  notifiedAt: string | null;
  createdAt: string;
}
