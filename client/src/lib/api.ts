import { supabase } from "./supabaseClient";
import type { ServiceRequest } from "../types";

class ApiError extends Error {}

// The requests table is snake_case (Postgres convention); every RPC returns
// rows shaped like it, so map once here instead of touching every caller.
function mapRow(row: Record<string, unknown>): ServiceRequest {
  return {
    id: row.id as number,
    ticket: row.ticket as string,
    type: row.type_label as string,
    summary: row.summary as string,
    name: row.name as string,
    dob: row.dob as string,
    phone: row.phone as string,
    email: row.email as string,
    status: row.status as ServiceRequest["status"],
    fee: (row.fee as number | null) ?? null,
    serviceLabel: (row.service_label as string | null) ?? null,
    paymentMethod: (row.payment_method as string | null) ?? null,
    decisionNote: (row.decision_note as string | null) ?? null,
    notifiedAt: (row.notified_at as string | null) ?? null,
    completedAt: (row.completed_at as string | null) ?? null,
    details: (row.details as Record<string, unknown>) ?? {},
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function submitRequest(type: string, fields: Record<string, unknown>): Promise<ServiceRequest> {
  const { name, dob, phone, email, ...rest } = fields as Record<string, string>;
  const { data, error } = await supabase.rpc("submit_request", {
    p_type: type,
    p_name: name,
    p_dob: dob,
    p_phone: phone,
    p_email: email,
    p_fields: rest,
  });
  if (error) throw new ApiError(error.message);
  return mapRow(data);
}

export async function trackRequest(ticket: string, name: string, dob: string): Promise<ServiceRequest> {
  const { data, error } = await supabase.rpc("track_request", { p_ticket: ticket, p_name: name, p_dob: dob });
  if (error) throw new ApiError(error.message);
  const rows = (data ?? []) as Record<string, unknown>[];
  if (rows.length === 0) {
    throw new ApiError("No matching request. Double-check the ticket number, name, and date of birth.");
  }
  return mapRow(rows[0]);
}

export async function payRequest(id: number, method: string): Promise<ServiceRequest> {
  const { data, error } = await supabase.rpc("pay_request", { p_id: id, p_method: method });
  if (error) throw new ApiError(error.message);
  return mapRow(data);
}

// `token` is kept in the signature for backward compatibility with the UI
// (it's stored as the "signed in" flag) but the Supabase client already
// attaches the active session to every RPC call on its own.
export async function staffLogin(email: string, password: string): Promise<{ token: string }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new ApiError(error.message);
  const token = data.session?.access_token;
  if (!token) throw new ApiError("Sign-in failed.");
  return { token };
}

export async function staffLogout(): Promise<void> {
  await supabase.auth.signOut();
}

export async function staffListRequests(_token: string): Promise<ServiceRequest[]> {
  const { data, error } = await supabase.rpc("staff_list_requests");
  if (error) throw new ApiError(error.message);
  return ((data ?? []) as Record<string, unknown>[]).map(mapRow);
}

export async function staffApprove(_token: string, id: number, fee?: number): Promise<ServiceRequest> {
  const { data, error } = await supabase.rpc("staff_approve_request", { p_id: id, p_fee: fee ?? null });
  if (error) throw new ApiError(error.message);
  return mapRow(data);
}

export async function staffReject(_token: string, id: number, note?: string): Promise<ServiceRequest> {
  const { data, error } = await supabase.rpc("staff_reject_request", { p_id: id, p_note: note ?? null });
  if (error) throw new ApiError(error.message);
  return mapRow(data);
}

export async function staffComplete(_token: string, id: number): Promise<ServiceRequest> {
  const { data, error } = await supabase.rpc("staff_complete_request", { p_id: id });
  if (error) throw new ApiError(error.message);
  return mapRow(data);
}

export { ApiError };
