import Constants from "expo-constants";
import { env } from "@/config/env";
import { LanguageId } from "@/types/problem";
import { supabase } from "@/lib/supabase";
import { SubmitResponse } from "@/types/codebox";

export function resolveApiBaseUrl() {
  if (env.apiBaseUrl) return env.apiBaseUrl;

  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as { manifest?: { hostUri?: string } }).manifest?.hostUri;

  return hostUri ? `http://${hostUri.split("/")[0]}` : "http://localhost:8081";
}

export async function submitSolution(params: {
  problemId: string;
  language: LanguageId;
  sourceCode: string;
}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token)
    throw new Error("You must be signed in to submit.");

  const response = await fetch(`${resolveApiBaseUrl()}/api/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(params),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(
      payload.error ?? payload.message ?? `Submit failed (${response.status})`,
    );
  }
  return payload as SubmitResponse;
}
