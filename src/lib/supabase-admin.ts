import { env, getServerEnv } from "@/config/env";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let admin: SupabaseClient | null = null;
let auth: SupabaseClient | null = null;

const clientOpts = {
  auth: { autoRefreshToken: false, persistSession: false },
};

function getAuthClient() {
  auth ??= createClient(
    env.supabaseUrl,
    env.supabaseAnonKey,
    clientOpts,
  );
  return auth;
}

export function getSupabaseAdmin() {
  admin ??= createClient(
    env.supabaseUrl,
    getServerEnv().SUPABASE_SERVICE_ROLE_KEY,
    clientOpts,
  );
  return admin;
}

export async function getUserFromRequest(request: Request) {
  const token = request.headers
    .get("Authorization")
    ?.replace("Bearer ", "")
    .trim();
  if (!token) return null;

  const { data } = await getAuthClient().auth.getUser(token);
  return data.user ?? null;
}
