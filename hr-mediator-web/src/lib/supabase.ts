import { createClient } from "@supabase/supabase-js";

// The anon key is designed to ship in the browser; every call is still
// governed by RLS and the SECURITY DEFINER RPCs. Fallbacks point at the
// production project so a missing env var never takes the site down.
const FALLBACK_URL = "https://dgxmouzxgbiigzmtalwo.supabase.co";
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRneG1vdXp4Z2JpaWd6bXRhbHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMjk2NTksImV4cCI6MjEwMzkwNTY1OX0.FyXfnuch7I9aUA9-T09fpiUubV84cl6q4VFURswJPrU";

const ASCII = /^[\x20-\x7E]+$/;
const pick = (v: string | undefined, fallback: string, shape: RegExp) =>
  v && ASCII.test(v) && shape.test(v) ? v : fallback;

export const SUPABASE_URL = pick(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  FALLBACK_URL,
  /^https:\/\/[a-z0-9.-]+\.supabase\.co$/,
);
const anonKey = pick(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  FALLBACK_ANON_KEY,
  /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/,
);

export const supabase = createClient(SUPABASE_URL, anonKey, {
  auth: { persistSession: false },
});
