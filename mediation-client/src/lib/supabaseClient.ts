import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — copy .env.example to .env and fill them in.");
}

// Same Supabase project as the concierge site (client/) — this app talks to
// the mediation-platform tables (profiles, cases, ...) from
// supabase/migrations/0003_mediation_platform.sql, gated by that
// migration's RLS policies rather than the concierge site's RPC pattern.
export const supabase = createClient(url, anonKey);
