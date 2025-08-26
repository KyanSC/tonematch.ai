import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase client is initialized
    if (!supabaseAdmin) {
      return Response.json(
        { 
          ok: false, 
          error: 'Database not configured',
          details: 'Missing Supabase environment variables'
        }, 
        { status: 503 }
      )
    }

    // Test database connectivity with a lightweight query
    const { data, error } = await supabaseAdmin
      .from('research_cache')
      .select('key')
      .limit(1)

    if (error) {
      console.error('Database health check failed:', error)
      return Response.json(
        { 
          ok: false, 
          error: 'Database connection failed',
          details: error.message 
        }, 
        { status: 500 }
      )
    }

    // Success - database is accessible
    return Response.json({ 
      ok: true, 
      db: 'up',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Health check error:', error)
    return Response.json(
      { 
        ok: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}
