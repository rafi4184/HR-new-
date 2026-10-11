import "server-only";
import { supabase } from "./supabase";
import type { Contact, EventItem } from "./types";

const EVENT_MEDIA_BUCKET = "event-media";

type Row = Record<string, unknown>;

function mapEvent(row: Row): EventItem {
  const media = ((row.media as Row[] | null) ?? [])
    .filter((m) => typeof m.storagePath === "string" && (m.storagePath as string).length > 0)
    .map((m) => {
      const path = m.storagePath as string;
      // A leading "/" means a static file shipped in /public, not a Storage object.
      const url = path.startsWith("/")
        ? path
        : supabase.storage.from(EVENT_MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
      return { id: m.id as number, mediaType: m.mediaType as "image" | "video", url };
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

// Public content should never crash a page: on any failure, log and render empty.
export async function getEvents(): Promise<EventItem[]> {
  try {
    const { data, error } = await supabase.rpc("list_events");
    if (error) throw error;
    return ((data ?? []) as Row[]).map(mapEvent);
  } catch (err) {
    console.error("list_events failed", err);
    return [];
  }
}

export async function getContacts(): Promise<Contact[]> {
  try {
    const { data, error } = await supabase.rpc("list_contacts");
    if (error) throw error;
    return ((data ?? []) as Row[]).map((r) => ({
      id: r.id as number,
      label: r.label as string,
      phone: (r.phone as string | null) ?? null,
      email: (r.email as string | null) ?? null,
      address: (r.address as string | null) ?? null,
      whatsapp: (r.whatsapp as string | null) ?? null,
    }));
  } catch (err) {
    console.error("list_contacts failed", err);
    return [];
  }
}

export function isUpcoming(e: EventItem, now = new Date()): boolean {
  if (!e.eventDate) return false;
  const d = new Date(e.eventDate);
  d.setHours(23, 59, 59);
  return d >= now;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dhaka" });
}
