import 'server-only'
import { createClient } from '@supabase/supabase-js'

// Server-only Supabase client with service role key (bypasses RLS)
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Create client only if environment variables are available
export const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Runtime validation function
function validateSupabaseConfig() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing required Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    } else {
      console.warn('⚠️  Missing Supabase environment variables. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your .env.local file')
    }
  }
}

// Research cache helpers
export async function getResearchCache(key: string) {
  validateSupabaseConfig()
  
  if (!supabaseAdmin) {
    return { data: null, error: new Error('Supabase client not initialized - missing environment variables') }
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('research_cache')
      .select('*')
      .eq('key', key)
      .single()

    return { data, error }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function setResearchCache(
  key: string, 
  payload: any, 
  confidence: number, 
  citations: any[], 
  mode: 'authoritative' | 'hypothesis'
) {
  validateSupabaseConfig()
  
  if (!supabaseAdmin) {
    return { data: null, error: new Error('Supabase client not initialized - missing environment variables') }
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('research_cache')
      .upsert({
        key,
        payload,
        confidence,
        citations,
        mode,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      })

    return { data, error }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

// Adaptation cache helpers
export async function getAdaptationCache(key: string) {
  validateSupabaseConfig()
  
  if (!supabaseAdmin) {
    return { data: null, error: new Error('Supabase client not initialized - missing environment variables') }
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('adaptation_cache')
      .select('*')
      .eq('key', key)
      .single()

    return { data, error }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function setAdaptationCache(
  key: string, 
  payload: any, 
  confidence: number
) {
  validateSupabaseConfig()
  
  if (!supabaseAdmin) {
    return { data: null, error: new Error('Supabase client not initialized - missing environment variables') }
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('adaptation_cache')
      .upsert({
        key,
        payload,
        confidence,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      })

    return { data, error }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}
