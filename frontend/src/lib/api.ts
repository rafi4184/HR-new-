import type { ServiceRequest } from "../types";

class ApiError extends Error {}

export interface StaffUser {
  id: string;
  username: string;
  name: string;
  role: "admin" | "staff";
  email?: string | null;
  mustResetPassword?: boolean;
  createdAt?: string;
  createdBy?: string | null;
}

export interface AuditEntry {
  id: string;
  actorId: string | null;
  actorUsername: string | null;
  actorRole: "admin" | "staff" | null;
  action:
    | "approve"
    | "reject"
    | "delete_request"
    | "create_user"
    | "delete_user"
    | "password_reset";
  targetType: "request" | "user" | null;
  targetId: string | null;
  targetLabel: string | null;
  meta: Record<string, unknown>;
  at: string;
}

export interface LoginResponse {
  token: string;
  user: StaffUser;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error || body.detail || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

// public
export function submitRequest(type: string, fields: Record<string, unknown>) {
  return request<ServiceRequest>(`/requests/${type}`, {
    method: "POST",
    body: JSON.stringify(fields),
  });
}
export function trackRequest(ticket: string, name: string, dob: string) {
  const params = new URLSearchParams({ ticket, name, dob });
  return request<ServiceRequest>(`/requests/track?${params.toString()}`);
}
export function payRequest(id: number, method: string) {
  return request<ServiceRequest>(`/requests/${id}/pay`, {
    method: "POST",
    body: JSON.stringify({ method }),
  });
}

// auth
export function staffLogin(username: string, password: string) {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}
export function fetchMe(token: string) {
  return request<StaffUser>("/auth/me", { headers: auth(token) });
}

export function changePassword(
  token: string,
  current_password: string,
  new_password: string,
) {
  return request<{ ok: boolean; user: StaffUser }>("/auth/change-password", {
    method: "POST",
    headers: auth(token),
    body: JSON.stringify({ current_password, new_password }),
  });
}

// staff
export function staffListRequests(token: string) {
  return request<ServiceRequest[]>("/staff/requests", { headers: auth(token) });
}
export function staffApprove(token: string, id: number, fee?: number) {
  return request<ServiceRequest>(`/staff/requests/${id}/approve`, {
    method: "POST",
    headers: auth(token),
    body: JSON.stringify({ fee }),
  });
}
export function staffReject(token: string, id: number, reason: string) {
  return request<ServiceRequest>(`/staff/requests/${id}/reject`, {
    method: "POST",
    headers: auth(token),
    body: JSON.stringify({ reason }),
  });
}
export function staffDeleteRequest(token: string, id: number) {
  return request<{ ok: boolean }>(`/staff/requests/${id}`, {
    method: "DELETE",
    headers: auth(token),
  });
}

export function bulkApprove(token: string, ids: number[], fee?: number) {
  return request<{ approved: ServiceRequest[]; skipped: number[] }>(
    "/staff/requests/bulk-approve",
    {
      method: "POST",
      headers: auth(token),
      body: JSON.stringify({ ids, fee }),
    }
  );
}

export function bulkReject(token: string, ids: number[], reason: string) {
  return request<{ rejected: ServiceRequest[]; skipped: number[] }>(
    "/staff/requests/bulk-reject",
    {
      method: "POST",
      headers: auth(token),
      body: JSON.stringify({ ids, reason }),
    }
  );
}

// admin
export function listUsers(token: string) {
  return request<StaffUser[]>("/staff/users", { headers: auth(token) });
}
export function createUser(
  token: string,
  data: {
    username: string;
    password: string;
    name: string;
    role: "admin" | "staff";
    email?: string;
    send_invite_email?: boolean;
  }
) {
  return request<StaffUser & { inviteSent?: boolean }>("/staff/users", {
    method: "POST",
    headers: auth(token),
    body: JSON.stringify(data),
  });
}

export function fetchStats(token: string) {
  return request<{ pending: number; approved: number; paid: number; rejected: number }>(
    "/staff/stats",
    { headers: auth(token) }
  );
}
export function deleteUser(token: string, id: string) {
  return request<{ ok: boolean }>(`/staff/users/${id}`, {
    method: "DELETE",
    headers: auth(token),
  });
}

export function listAuditLog(token: string) {
  return request<AuditEntry[]>("/staff/audit-log", { headers: auth(token) });
}

export { ApiError };
