import type { ServiceRequest } from "../types";

class ApiError extends Error {}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error || `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

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

export function staffLogin(username: string, password: string) {
  return request<{ token: string }>("/staff/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function staffListRequests(token: string) {
  return request<ServiceRequest[]>("/staff/requests", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function staffApprove(token: string, id: number, fee?: number) {
  return request<ServiceRequest>(`/staff/requests/${id}/approve`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ fee }),
  });
}

export { ApiError };
