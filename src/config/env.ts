import { z } from "zod";

/**
 * Client-safe environment variables.
 *
 * NOTE: Expo only inlines `EXPO_PUBLIC_*` variables when they are statically
 * referenced as `process.env.EXPO_PUBLIC_[NAME]` using dot notation. That is
 * why each variable is referenced individually below instead of passing
 * `process.env` directly to the schema.
 */
const clientEnvSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string().trim().url(),
  EXPO_PUBLIC_SUPABASE_KEY: z.string().trim().min(1),
  EXPO_PUBLIC_API_BASE_URL: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().trim().url().optional(),
  ),
});

const rawClientEnv = {
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_KEY: process.env.EXPO_PUBLIC_SUPABASE_KEY,
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
};

const parsedClientEnv = parseOrThrow(clientEnvSchema, rawClientEnv);

/** Validated, client-safe environment variables. */
export const env = {
  supabaseUrl: parsedClientEnv.EXPO_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: parsedClientEnv.EXPO_PUBLIC_SUPABASE_KEY,
  apiBaseUrl: parsedClientEnv.EXPO_PUBLIC_API_BASE_URL,
} as const;

/**
 * Server-only environment variables (API routes). Parsed lazily so importing
 * this module on the client never fails on missing secrets.
 */
const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().trim().min(1),
  CODEBOX_TOKEN: z.string().trim().min(1),
});

let cachedServerEnv: z.infer<typeof serverEnvSchema> | null = null;

/** Validated, server-only environment variables. Throws if misconfigured. */
export function getServerEnv() {
  cachedServerEnv ??= parseOrThrow(serverEnvSchema, {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    CODEBOX_TOKEN: process.env.CODEBOX_TOKEN,
  });
  return cachedServerEnv;
}

function parseOrThrow<T extends z.ZodType>(
  schema: T,
  value: unknown,
): z.output<T> {
  const result = schema.safeParse(value);
  if (result.success) return result.data;

  const issues = result.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(
    `Invalid environment variables.\n${issues}\n` +
      "Check your .env file and restart Expo.",
  );
}
