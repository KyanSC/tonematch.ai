export function getEnvVar(key: string): string | undefined {
  if (typeof window !== 'undefined') {
    return undefined
  }
  return process.env[key]
}

export function requireEnvVar(key: string): string {
  const value = getEnvVar(key)
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}
