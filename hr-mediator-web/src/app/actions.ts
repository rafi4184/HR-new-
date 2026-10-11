"use server";

import { supabase } from "@/lib/supabase";
import type { RequestType, TrackedRequest } from "@/lib/types";

// Only these keys are forwarded to submit_request's p_fields per type, so the
// stored `details` stays clean no matter what the browser posts.
const FIELDS: Record<RequestType, string[]> = {
  airport: ["flight", "airport", "date", "time", "purpose", "travelers", "notes"],
  hotel: ["city", "tier", "checkin", "checkout", "car", "pickup", "notes"],
  government: ["service", "urgency", "description"],
  program: ["program", "batch", "background", "notes"],
};

export type SubmitState = { ticket?: string; error?: string };
export type TrackState = { request?: TrackedRequest; error?: string };

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

export async function submitRequest(_prev: SubmitState, fd: FormData): Promise<SubmitState> {
  const type = str(fd, "type") as RequestType;
  if (!(type in FIELDS)) return { error: "Please choose a request type." };

  const fields: Record<string, string> = {};
  for (const k of FIELDS[type]) {
    const v = str(fd, k);
    if (v) fields[k] = v;
  }

  try {
    const { data, error } = await supabase.rpc("submit_request", {
      p_type: type,
      p_name: str(fd, "name"),
      p_dob: str(fd, "dob") || null,
      p_phone: str(fd, "phone"),
      p_email: str(fd, "email"),
      p_fields: fields,
    });
    if (error) return { error: error.message };
    return { ticket: (data as { ticket: string }).ticket };
  } catch (err) {
    console.error("submit_request failed", err);
    return { error: "Couldn't submit that request. Please try again." };
  }
}

export async function trackRequest(_prev: TrackState, fd: FormData): Promise<TrackState> {
  const ticket = str(fd, "ticket");
  const name = str(fd, "name");
  const dob = str(fd, "dob");
  if (!ticket || !name || !dob) return { error: "Enter your ticket number, full name and date of birth." };

  try {
    const { data, error } = await supabase.rpc("track_request", { p_ticket: ticket, p_name: name, p_dob: dob });
    if (error) return { error: error.message };
    const row = ((data ?? []) as Record<string, unknown>[])[0];
    if (!row) return { error: "No matching request. Double-check the ticket number, name, and date of birth." };
    // Only customer-safe fields leave the server (no internal notes, contact details, etc.).
    return {
      request: {
        ticket: row.ticket as string,
        typeLabel: row.type_label as string,
        summary: row.summary as string,
        status: row.status as TrackedRequest["status"],
        fee: (row.fee as number | null) ?? null,
        decisionNote: (row.decision_note as string | null) ?? null,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
      },
    };
  } catch (err) {
    console.error("track_request failed", err);
    return { error: "Couldn't look up that request. Please try again." };
  }
}
