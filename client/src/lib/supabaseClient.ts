import { createClient } from "@supabase/supabase-js";

// This project's Supabase URL and anon (public) key. The anon key is
// *designed* to be embedded in the browser bundle — every request it
// makes is still governed by Row Level Security, so it isn't a secret —
// which is what makes it safe to hardcode as a fallback here. That
// fallback matters because a hosting platform's env var UI can silently
// corrupt a pasted value (a smart quote or em dash slipping in from a
// copy-paste), and a corrupted apikey/Authorization header breaks every
// single request with a cryptic "Headers: non ISO-8859-1 code point"
// error — exactly what happened here once. Validating the env var's
// shape before trusting it means a bad paste in the dashboard can never
// take the whole site down again; VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
// still override this for local dev against a different project, as long
// as they're well-formed.
const FALLBACK_URL = "https://dgxmouzxgbiigzmtalwo.supabase.co";
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRneG1vdXp4Z2JpaWd6bXRhbHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMjk2NTksImV4cCI6MjEwMzkwNTY1OX0.FyXfnuch7I9aUA9-T09fpiUubV84cl6q4VFURswJPrU";

const ASCII_ONLY = /^[\x20-\x7E]+$/;
const JWT_SHAPE = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

function pick(envValue: string | undefined, fallback: string, shapeCheck: RegExp): string {
  if (envValue && ASCII_ONLY.test(envValue) && shapeCheck.test(envValue)) return envValue;
  return fallback;
}

const url = pick(import.meta.env.VITE_SUPABASE_URL, FALLBACK_URL, /^https:\/\/[a-z0-9.-]+\.supabase\.co$/);
const anonKey = pick(import.meta.env.VITE_SUPABASE_ANON_KEY, FALLBACK_ANON_KEY, JWT_SHAPE);

export const supabase = createClient(url, anonKey);
