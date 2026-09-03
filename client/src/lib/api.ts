import { supabase } from "./supabaseClient";
import type { AuditLogEntry, Contact, EventItem, ServiceRequest, StaffMember, TeamMember, WhoAmI } from "../types";

class ApiError extends Error {}

const EVENT_MEDIA_BUCKET = "event-media";

function mapContact(row: Record<string, unknown>): Contact {
  return {
    id: row.id as number,
    label: row.label as string,
    phone: (row.phone as string | null) ?? null,
    email: (row.email as string | null) ?? null,
    address: (row.address as string | null) ?? null,
    whatsapp: (row.whatsapp as string | null) ?? null,
    sortOrder: row.sort_order as number,
  };
}

function mapEvent(row: Record<string, unknown>): EventItem {
  const media = ((row.media as Record<string, unknown>[] | null) ?? []).map((m) => {
    const storagePath = m.storagePath as string;
    return {
      id: m.id as number,
      mediaType: m.mediaType as "image" | "video",
      storagePath,
      url: supabase.storage.from(EVENT_MEDIA_BUCKET).getPublicUrl(storagePath).data.publicUrl,
    };
  });
  return {
    id: row.id as number,
    title: row.title as string,
    description: (row.description as string | null) ?? null,
    eventDate: (row.event_date as string | null) ?? null,
    location: (row.location as string | null) ?? null,
    media,
  };
}

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

// Wraps a Supabase call so a raw browser/runtime exception thrown before
// we even get a {data,error} result (a broken env var producing an
// unsendable header, a network drop, anything) never reaches the UI as
// unreadable technical text — only a genuine ApiError (from an `error`
// the RPC itself returned) keeps its specific message.
async function callRpc<T>(
  fn: () => PromiseLike<{ data: T; error: { message: string } | null }>,
  fallback: string
): Promise<T> {
  let result: { data: T; error: { message: string } | null };
  try {
    result = await fn();
  } catch (err) {
    console.error(fallback, err);
    throw new ApiError(fallback);
  }
  if (result.error) throw new ApiError(result.error.message);
  return result.data;
}

export async function submitRequest(type: string, fields: Record<string, unknown>): Promise<ServiceRequest> {
  const { name, dob, phone, email, ...rest } = fields as Record<string, string>;
  const data = await callRpc(
    () =>
      supabase.rpc("submit_request", {
        p_type: type,
        p_name: name,
        p_dob: dob,
        p_phone: phone,
        p_email: email,
        p_fields: rest,
      }),
    "Couldn't submit that request. Please try again."
  );
  return mapRow(data);
}

export async function trackRequest(ticket: string, name: string, dob: string): Promise<ServiceRequest> {
  const data = await callRpc(
    () => supabase.rpc("track_request", { p_ticket: ticket, p_name: name, p_dob: dob }),
    "Couldn't look up that request. Please try again."
  );
  const rows = (data ?? []) as Record<string, unknown>[];
  if (rows.length === 0) {
    throw new ApiError("No matching request. Double-check the ticket number, name, and date of birth.");
  }
  return mapRow(rows[0]);
}

export async function payRequest(id: number, method: string): Promise<ServiceRequest> {
  const data = await callRpc(
    () => supabase.rpc("pay_request", { p_id: id, p_method: method }),
    "Couldn't process that payment. Please try again."
  );
  return mapRow(data);
}

// `token` is kept in the signature for backward compatibility with the UI
// (it's stored as the "signed in" flag) but the Supabase client already
// attaches the active session to every RPC call on its own.
//
// Staff sign in with a Staff ID, never an email — the staff-login Edge
// Function resolves the ID to the right account server-side and hands
// back a real Supabase session, which we then adopt locally.
export async function staffLogin(staffId: string, password: string): Promise<{ token: string }> {
  const { data, error } = await supabase.functions.invoke("staff-login", {
    body: { staffId, password },
  });
  if (error) {
    const message = (data as { error?: string } | null)?.error ?? "Invalid Staff ID or password.";
    throw new ApiError(message);
  }
  if (data?.error) throw new ApiError(data.error as string);

  const { accessToken, refreshToken } = data as { accessToken: string; refreshToken: string };
  const { error: setErr } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  if (setErr) throw new ApiError(setErr.message);
  return { token: accessToken };
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

export async function whoami(): Promise<WhoAmI | null> {
  const { data, error } = await supabase.rpc("whoami");
  if (error) throw new ApiError(error.message);
  const rows = (data ?? []) as Record<string, unknown>[];
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    userId: row.user_id as string,
    email: row.email as string,
    isAdmin: row.is_admin as boolean,
    role: row.role as WhoAmI["role"],
    managerId: (row.manager_id as string | null) ?? null,
    staffId: (row.staff_id as string | null) ?? null,
  };
}

export async function changePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new ApiError(error.message);
}

// --- Contacts -----------------------------------------------------------

export async function listContacts(): Promise<Contact[]> {
  const { data, error } = await supabase.rpc("list_contacts");
  if (error) throw new ApiError(error.message);
  return ((data ?? []) as Record<string, unknown>[]).map(mapContact);
}

export async function adminUpsertContact(contact: {
  id?: number;
  label: string;
  phone?: string;
  email?: string;
  address?: string;
  whatsapp?: string;
  sortOrder?: number;
}): Promise<Contact> {
  const { data, error } = await supabase.rpc("admin_upsert_contact", {
    p_id: contact.id ?? null,
    p_label: contact.label,
    p_phone: contact.phone ?? null,
    p_email: contact.email ?? null,
    p_address: contact.address ?? null,
    p_whatsapp: contact.whatsapp ?? null,
    p_sort_order: contact.sortOrder ?? 0,
  });
  if (error) throw new ApiError(error.message);
  return mapContact(data);
}

export async function adminDeleteContact(id: number): Promise<void> {
  const { error } = await supabase.rpc("admin_delete_contact", { p_id: id });
  if (error) throw new ApiError(error.message);
}

// --- Events ---------------------------------------------------------------

export async function listEvents(): Promise<EventItem[]> {
  const { data, error } = await supabase.rpc("list_events");
  if (error) throw new ApiError(error.message);
  return ((data ?? []) as Record<string, unknown>[]).map(mapEvent);
}

export async function adminUpsertEvent(event: {
  id?: number;
  title: string;
  description?: string;
  eventDate?: string;
  location?: string;
}): Promise<EventItem> {
  const { data, error } = await supabase.rpc("admin_upsert_event", {
    p_id: event.id ?? null,
    p_title: event.title,
    p_description: event.description ?? null,
    p_event_date: event.eventDate ?? null,
    p_location: event.location ?? null,
  });
  if (error) throw new ApiError(error.message);
  return mapEvent({ ...(data as Record<string, unknown>), media: [] });
}

export async function adminDeleteEvent(id: number): Promise<void> {
  const { error } = await supabase.rpc("admin_delete_event", { p_id: id });
  if (error) throw new ApiError(error.message);
}

export async function adminUploadEventMedia(
  eventId: number,
  file: File,
  mediaType: "image" | "video",
  sortOrder = 0,
): Promise<void> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${eventId}/${crypto.randomUUID()}.${ext}`;
  const { error: uploadErr } = await supabase.storage.from(EVENT_MEDIA_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadErr) throw new ApiError(uploadErr.message);

  const { error } = await supabase.rpc("admin_add_event_media", {
    p_event_id: eventId,
    p_media_type: mediaType,
    p_storage_path: path,
    p_sort_order: sortOrder,
  });
  if (error) throw new ApiError(error.message);
}

export async function adminDeleteEventMedia(id: number): Promise<void> {
  const { error } = await supabase.rpc("admin_delete_event_media", { p_id: id });
  if (error) throw new ApiError(error.message);
}

// --- Staff management -------------------------------------------------

export async function adminListStaff(): Promise<StaffMember[]> {
  const { data, error } = await supabase.rpc("admin_list_staff");
  if (error) throw new ApiError(error.message);
  return ((data ?? []) as Record<string, unknown>[]).map((row) => ({
    userId: row.user_id as string,
    staffId: row.staff_id as string,
    isAdmin: row.is_admin as boolean,
    role: row.role as StaffMember["role"],
    managerId: (row.manager_id as string | null) ?? null,
    managerStaffId: (row.manager_staff_id as string | null) ?? null,
    createdAt: row.created_at as string,
  }));
}

export async function executiveListStaff(): Promise<TeamMember[]> {
  const { data, error } = await supabase.rpc("executive_list_staff");
  if (error) throw new ApiError(error.message);
  return ((data ?? []) as Record<string, unknown>[]).map((row) => ({
    userId: row.user_id as string,
    staffId: row.staff_id as string,
    createdAt: row.created_at as string,
  }));
}

export async function adminCreateStaff(
  staffId: string,
  password: string,
  role: StaffMember["role"] = "staff",
  managerId?: string | null,
): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new ApiError("You need to be signed in.");

  const { data, error } = await supabase.functions.invoke("admin-create-staff", {
    body: { staffId, password, role, managerId: managerId ?? null },
    headers: { Authorization: `Bearer ${token}` },
  });
  if (error) {
    const message = (data as { error?: string } | null)?.error ?? error.message;
    throw new ApiError(message);
  }
  if (data?.error) throw new ApiError(data.error as string);
}

export async function adminResetStaffPassword(userId: string, newPassword: string): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new ApiError("You need to be signed in.");

  const { data, error } = await supabase.functions.invoke("admin-reset-staff-password", {
    body: { userId, newPassword },
    headers: { Authorization: `Bearer ${token}` },
  });
  if (error) {
    const message = (data as { error?: string } | null)?.error ?? error.message;
    throw new ApiError(message);
  }
  if (data?.error) throw new ApiError(data.error as string);
}

export async function adminSetStaffRole(
  userId: string,
  role: StaffMember["role"],
  managerId?: string | null,
): Promise<void> {
  const { error } = await supabase.rpc("admin_set_staff_role", {
    p_user_id: userId,
    p_role: role,
    p_manager_id: managerId ?? null,
  });
  if (error) throw new ApiError(error.message);
}

export async function adminRemoveStaff(userId: string): Promise<void> {
  const { error } = await supabase.rpc("admin_remove_staff", { p_user_id: userId });
  if (error) throw new ApiError(error.message);
}

export async function executiveRemoveStaff(userId: string): Promise<void> {
  const { error } = await supabase.rpc("executive_remove_staff", { p_user_id: userId });
  if (error) throw new ApiError(error.message);
}

// --- Audit log ----------------------------------------------------------

export async function adminListAuditLog(limit = 100): Promise<AuditLogEntry[]> {
  const { data, error } = await supabase.rpc("admin_list_audit_log", { p_limit: limit });
  if (error) throw new ApiError(error.message);
  return ((data ?? []) as Record<string, unknown>[]).map((row) => ({
    id: row.id as number,
    actorStaffId: (row.actor_staff_id as string | null) ?? null,
    action: row.action as string,
    entity: row.entity as string,
    entityId: (row.entity_id as string | null) ?? null,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    createdAt: row.created_at as string,
  }));
}

export { ApiError };
