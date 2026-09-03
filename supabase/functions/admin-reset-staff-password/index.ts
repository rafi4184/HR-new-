// Supabase Edge Function: lets a signed-in admin set a new password for an
// existing staff account (e.g. when someone forgets theirs). Same shape as
// admin-create-staff — updating another user's password needs the
// service_role key, which only an Edge Function can hold securely.

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

interface ResetPasswordPayload {
  userId: string;
  newPassword: string;
}

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

  const { data: callerData, error: callerErr } = await admin.auth.getUser(callerToken);
  if (callerErr || !callerData.user) {
    return json({ error: "Invalid session" }, 401);
  }

  const { data: staffRow } = await admin
    .from("staff")
    .select("is_admin, role, staff_id")
    .eq("user_id", callerData.user.id)
    .maybeSingle();

  if (!staffRow?.is_admin && staffRow?.role !== "executive") {
    return json({ error: "Admin access required" }, 403);
  }

  let payload: ResetPasswordPayload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const { userId, newPassword } = payload;
  if (!userId) {
    return json({ error: "Missing userId." }, 400);
  }
  if (!newPassword || newPassword.length < 8) {
    return json({ error: "Password must be at least 8 characters." }, 400);
  }

  // Confirm the target is actually a staff member, not an arbitrary auth user.
  const { data: targetStaff } = await admin
    .from("staff")
    .select("user_id, role, manager_id, staff_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (!targetStaff) {
    return json({ error: "That user isn't a staff member." }, 404);
  }

  // A non-admin caller must be the executive this staff member reports to
  // — never someone else's team, and never another executive or admin.
  if (!staffRow.is_admin) {
    const onCallersTeam = targetStaff.role === "staff" && targetStaff.manager_id === callerData.user.id;
    if (!onCallersTeam) {
      return json({ error: "You can only reset passwords for your own team." }, 403);
    }
  }

  const { error: updateErr } = await admin.auth.admin.updateUserById(userId, { password: newPassword });
  if (updateErr) {
    return json({ error: updateErr.message }, 400);
  }

  await admin.from("audit_log").insert({
    actor_user_id: callerData.user.id,
    actor_staff_id: staffRow.staff_id,
    action: "reset_password",
    entity: "staff",
    entity_id: userId,
    metadata: { staff_id: targetStaff.staff_id },
  });

  return json({ ok: true });
});
