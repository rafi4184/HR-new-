// Supabase Edge Function: the front page's staff sign-in. Takes a Staff ID
// + password, resolves the Staff ID to the account's (never-shown) real
// auth email server-side using the service_role key, then signs in on the
// caller's behalf with the anon client — the same password check Supabase
// Auth always does, just fronted by an ID instead of an email so nobody
// using the app ever needs to know or type one.
//
// Deployed with verify_jwt: false — this IS the login step, so the caller
// has no session yet. Every response uses the same generic error message
// for "no such Staff ID" and "wrong password" so this can't be used to
// enumerate which Staff IDs exist.

import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

interface LoginPayload {
  staffId: string;
  password: string;
}

const GENERIC_ERROR = "Invalid Staff ID or password.";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let payload: LoginPayload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const staffId = payload.staffId?.trim().toLowerCase();
  const password = payload.password ?? "";
  if (!staffId || !password) {
    return json({ error: "Enter your Staff ID and password." }, 400);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: staffRow } = await admin
    .from("staff")
    .select("user_id")
    .eq("staff_id", staffId)
    .maybeSingle();
  if (!staffRow) {
    return json({ error: GENERIC_ERROR }, 401);
  }

  const { data: userData, error: userErr } = await admin.auth.admin.getUserById(staffRow.user_id);
  if (userErr || !userData.user?.email) {
    return json({ error: GENERIC_ERROR }, 401);
  }

  const anon = createClient(SUPABASE_URL, ANON_KEY);
  const { data: signInData, error: signInErr } = await anon.auth.signInWithPassword({
    email: userData.user.email,
    password,
  });
  if (signInErr || !signInData.session) {
    return json({ error: GENERIC_ERROR }, 401);
  }

  return json({
    accessToken: signInData.session.access_token,
    refreshToken: signInData.session.refresh_token,
  });
});
