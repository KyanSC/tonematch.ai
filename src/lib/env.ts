/**
 * Safe environment variable reader
 */

export function getEnvVar(key: string): string | undefined {
  return process.env[key]
}

export function requireEnvVar(key: string): string {
  const value = getEnvVar(key)
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

// Server-only environment variables - never import in client components
export function getSupabaseUrl(): string | undefined {
  return getEnvVar('SUPABASE_URL')
}

export function getSupabaseServiceRoleKey(): string | undefined {
  return getEnvVar('SUPABASE_SERVICE_ROLE_KEY')
}

export function requireSupabaseUrl(): string {
  return requireEnvVar('SUPABASE_URL')
}

export function requireSupabaseServiceRoleKey(): string {
  return requireEnvVar('SUPABASE_SERVICE_ROLE_KEY')
}
