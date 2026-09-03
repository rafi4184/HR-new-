// Supabase Edge Function: lets a signed-in admin create a new staff
// account identified by a Staff ID (not an email) + a password the admin
// chooses. Supabase Auth still requires an email internally for every
// account, so this generates an unguessable, never-shown-to-anyone
// placeholder in a fake internal domain purely to satisfy that — nobody
// ever logs in with it; login goes through staff-login, which resolves a
// Staff ID to the right account server-side. Creating a Supabase Auth
// user requires the service_role key, which only an Edge Function can
// hold securely — that's why this can't be a plain SQL RPC.
//
// Deployed with verify_jwt: true, so only a request carrying a valid
// Supabase session JWT reaches this code at all. The admin check below is
// a second, independent gate on top of that.
//
// Called directly from the browser (supabase.functions.invoke), unlike
// notify-decision which is only ever called server-side from a Postgres
// trigger — so this one needs CORS headers, including handling the
// preflight OPTIONS request, or the browser blocks it before it arrives.

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

interface CreateStaffPayload {
  staffId: string;
  password: string;
  role?: "admin" | "executive" | "staff";
  managerId?: string | null;
}

const STAFF_ID_RE = /^[a-zA-Z0-9._-]{2,32}$/;
const EMAIL_DOMAIN = "staff.hrthemediator.internal";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const callerToken = authHeader.replace(/^Bearer\s+/i, "");
  if (!callerToken) {
    return json({ error: "Missing Authorization header" }, 401);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // Who's calling, and are they actually an admin?
  const { data: callerData, error: callerErr } = await admin.auth.getUser(callerToken);
  if (callerErr || !callerData.user) {
    return json({ error: "Invalid session" }, 401);
  }

  const { data: staffRow } = await admin
    .from("staff")
    .select("is_admin, staff_id")
    .eq("user_id", callerData.user.id)
    .maybeSingle();

  if (!staffRow?.is_admin) {
    return json({ error: "Admin access required" }, 403);
  }

  let payload: CreateStaffPayload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const staffId = payload.staffId?.trim().toLowerCase();
  const password = payload.password ?? "";
  if (!staffId || !STAFF_ID_RE.test(staffId)) {
    return json({ error: "Staff ID must be 2-32 letters, numbers, dots, dashes or underscores." }, 400);
  }
  if (password.length < 8) {
    return json({ error: "Password must be at least 8 characters." }, 400);
  }

  const role = payload.role ?? "staff";
  if (!["admin", "executive", "staff"].includes(role)) {
    return json({ error: "Invalid role." }, 400);
  }

  const { data: existing } = await admin.from("staff").select("user_id").eq("staff_id", staffId).maybeSingle();
  if (existing) {
    return json({ error: "That Staff ID is already in use." }, 400);
  }

  let managerId: string | null = null;
  if (role === "staff" && payload.managerId) {
    const { data: manager } = await admin
      .from("staff")
      .select("user_id, role")
      .eq("user_id", payload.managerId)
      .maybeSingle();
    if (!manager || manager.role !== "executive") {
      return json({ error: "That manager is not an executive." }, 400);
    }
    managerId = payload.managerId;
  }

  // A placeholder Supabase Auth requires internally but that's never shown
  // to, or usable as a login by, anyone — sign-in only ever goes through
  // staff-login, keyed on staffId.
  const placeholderEmail = `${staffId}.${crypto.randomUUID().slice(0, 8)}@${EMAIL_DOMAIN}`;

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: placeholderEmail,
    password,
    email_confirm: true,
  });
  if (createErr || !created.user) {
    return json({ error: createErr?.message ?? "Could not create user." }, 400);
  }

  const { error: staffErr } = await admin
    .from("staff")
    .insert({ user_id: created.user.id, is_admin: role === "admin", role, manager_id: managerId, staff_id: staffId });
  if (staffErr) {
    // Roll back the auth user so we don't leave an orphaned account with no staff access.
    await admin.auth.admin.deleteUser(created.user.id);
    return json({ error: staffErr.message }, 400);
  }

  await admin.from("audit_log").insert({
    actor_user_id: callerData.user.id,
    actor_staff_id: staffRow.staff_id,
    action: "create_staff",
    entity: "staff",
    entity_id: created.user.id,
    metadata: { staff_id: staffId, role },
  });

  return json({ userId: created.user.id, staffId });
});
