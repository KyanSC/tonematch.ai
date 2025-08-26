// Requires Responses API. Docs: platform.openai.com/docs/guides/tools-web-search (tools) and /api-reference/responses (endpoint)
import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { getResearchCache, setResearchCache } from '@/lib/supabaseServer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

// TypeScript types for the API
interface ResearchToneRequest {
  song: string
  artist?: string
  part: 'riff' | 'solo'
}

interface OriginalGear {
  guitar: string
  pickups: string
  amp: string
  notes?: string
}

interface AmpSettings {
  gain?: number
  bass?: number
  mid?: number
  treble?: number
  presence?: number
  reverb?: number
}

interface Citation {
  title: string
  url: string
}

interface SectionProfile {
  distortion: "clean" | "edge" | "crunch" | "high-gain"
  confidence: number
  evidence_phrases?: string[]
}

interface ResearchResult {
  original_gear: {
    guitar: string
    pickups: string
    amp: string
    notes?: string
  }
  settings: {
    gain: number
    bass: number
    mid: number
    treble: number
    presence?: number
    reverb?: number
  }
  guitar_knob_settings?: {
    volume: string
    tone: string
  }
  section_profile: SectionProfile
  citations: Array<{
    title: string
    url: string
  }>
  confidence: number
  warnings: string[]
  song?: string
  artist?: string
}

// Cache TTL: 24 hours in milliseconds
const CACHE_TTL = 24 * 60 * 60 * 1000

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body: ResearchToneRequest = await request.json()
    
    if (!body.song || typeof body.song !== 'string' || body.song.trim().length === 0) {
      return Response.json(
        { ok: false, error: 'Song title is required and cannot be empty' },
        { status: 400 }
      )
    }
    
    if (!body.part || !['riff', 'solo'].includes(body.part)) {
      return Response.json(
        { ok: false, error: 'Part must be either "riff" or "solo"' },
        { status: 400 }
      )
    }

    // Build cache key
    const key = `${body.song.trim().toLowerCase()}|${body.artist?.trim().toLowerCase() || 'unknown'}|${body.part}`
    
    // Check cache first
    const { data: cachedData, error: cacheError } = await getResearchCache(key)
    
    if (cacheError) {
      console.error('Cache lookup error:', cacheError)
    } else if (cachedData) {
      const createdAt = new Date(cachedData.created_at || cachedData.updated_at)
      const now = new Date()
      
      // Check if cache is still valid (within 24 hours)
      if (now.getTime() - createdAt.getTime() < CACHE_TTL) {
        return Response.json({
          ok: true,
          data: cachedData.payload,
          cached: true,
          cached_at: createdAt.toISOString()
        })
      }
    }

    // Validate OpenAI configuration
    const openaiApiKey = process.env.OPENAI_API_KEY
    const openaiModel = process.env.OPENAI_MODEL_RESEARCH
    
    if (!openaiApiKey) {
      console.error('Missing OPENAI_API_KEY environment variable')
      return Response.json(
        { ok: false, error: 'Server not configured' },
        { status: 503 }
      )
    }
    
    if (!openaiModel) {
      console.error('Missing OPENAI_MODEL_RESEARCH environment variable')
      return Response.json(
        { ok: false, error: 'Server not configured' },
        { status: 503 }
      )
    }

    // Create OpenAI client
    const client = new OpenAI({ apiKey: openaiApiKey })

    let researchResult: ResearchResult
    let mode: 'authoritative' | 'hypothesis' = 'authoritative'
    let confidence = 1.0

    try {
      // Use Responses API with web search tool for real web data
      console.log('Attempting Responses API with web search...')
      const response = await client.responses.create({
        model: openaiModel,
        input: `Research the guitar tone for "${body.song}" by ${body.artist || 'unknown artist'} - ${body.part} section. 

SEARCH FOR:
1. Specific amp settings, pickup selector positions, and guitar knob settings for this exact song
2. Guitar rig rundowns, gear interviews, and technical articles
3. Amp settings guides, tone tutorials, and gear recommendations
4. Official gear lists, studio notes, and live setup information
5. Guitar volume and tone knob settings, pickup selector positions

IMPORTANT: For guitar knob settings, look for specific numbers (e.g., "volume at 7", "tone at 6") rather than generic terms like "full" or "high". Be precise with the settings found.

SEARCH TERMS TO USE:
- "${body.song}" "${body.artist}" amp settings
- "${body.song}" "${body.artist}" guitar tone settings
- "${body.song}" "${body.artist}" rig rundown
- "${body.song}" "${body.artist}" gear setup
- "${body.song}" "${body.artist}" amp knobs
- "${body.song}" "${body.artist}" tone guide
- "${body.song}" "${body.artist}" guitar volume tone knobs
- "${body.song}" "${body.artist}" guitar pickup selector position
- "${body.song}" "${body.artist}" guitar volume tone settings
- "${body.song}" "${body.artist}" guitar knob positions
- "${body.song}" "${body.artist}" guitar controls settings
- "${body.song}" "${body.artist}" guitar volume tone knob settings
- "${body.song}" "${body.artist}" guitar volume tone controls

PREFERRED SOURCES:
- Guitar World, Guitar Player, Premier Guitar, ToneDB, Reddit, Quora, other guitar forums
- Rig rundown videos and interviews
- Gear forums and communities
- Official artist websites and interviews
- Studio and live setup documentation
- User reviews and comments

IMPORTANT: For clean tones, set gain to 0 or very low (1-2). For distorted/overdriven tones, use appropriate gain levels (3-10). Consider the musical style and tone characteristics.

GAIN RULES:
- If the tone is clean, set gain to 0
- If the tone has light overdrive, set gain to 1-2
- If the tone is distorted, set gain to 3-10
- Always prioritize clean tone detection and set gain to 0 when appropriate

SECTION CLASSIFICATION:
Classify the requested SECTION's distortion level as one of:
- "clean" | "edge" | "crunch" | "high-gain"
Only mark "clean" if at least one source explicitly describes a clean/no-drive guitar sound for THIS section (riff vs solo). Otherwise choose edge/crunch/high-gain.

CRITICAL: You MUST return ONLY a valid JSON object. Do not include any text before or after the JSON. Do not use markdown formatting. The response must start with { and end with }.

IMPORTANT: Use the exact song and artist names as found in your research. If the user made typos, correct them based on the actual song/artist names found online.

Return the information in this EXACT JSON format:
{
  "original_gear": {
    "guitar": "string",
    "pickups": "string", 
    "amp": "string",
    "notes": "string"
  },
  "settings": {
    "gain": number,
    "bass": number,
    "mid": number,
    "treble": number,
    "presence": number,
    "reverb": number
  },
  "guitar_knob_settings": {
    "volume": "string (e.g., '7', '8-9', 'full')",
    "tone": "string (e.g., '6', '7-8', 'full')"
  },
  "section_profile": {
    "distortion": "clean" | "edge" | "crunch" | "high-gain",
    "confidence": number,
    "evidence_phrases": ["short quoted phrases from sources that indicate clean vs distorted"]
  },
  "citations": [
    {
      "title": "string",
      "url": "string"
    }
  ],
  "confidence": number,
  "warnings": ["string"],
  "song": "string",
  "artist": "string"
}`,
        tools: [{
          type: "web_search_preview"
        }]
      })

      const outputText = response.output_text
      if (!outputText) { throw new Error('No output text in response') }

      // Debug: Log the raw web search response
      console.log('Web search response length:', outputText.length)
      console.log('Web search response preview:', outputText.substring(0, 500))

      try {
        const jsonMatch = outputText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          researchResult = JSON.parse(jsonMatch[0])
        } else {
          researchResult = JSON.parse(outputText)
        }
        
        // Debug: Log the parsed result
        console.log('Parsed research result:', JSON.stringify(researchResult, null, 2))
        
        // Post-process: Validate and clamp amp settings to 0-10 range
        if (researchResult.settings) {
          const clampToRange = (value: number): number => Math.max(0, Math.min(10, Math.round(value)))
          
          if (typeof researchResult.settings.gain === 'number') {
            researchResult.settings.gain = clampToRange(researchResult.settings.gain)
          }
          if (typeof researchResult.settings.bass === 'number') {
            researchResult.settings.bass = clampToRange(researchResult.settings.bass)
          }
          if (typeof researchResult.settings.mid === 'number') {
            researchResult.settings.mid = clampToRange(researchResult.settings.mid)
          }
          if (typeof researchResult.settings.treble === 'number') {
            researchResult.settings.treble = clampToRange(researchResult.settings.treble)
          }
          if (typeof researchResult.settings.presence === 'number') {
            researchResult.settings.presence = clampToRange(researchResult.settings.presence)
          }
          if (typeof researchResult.settings.reverb === 'number') {
            researchResult.settings.reverb = clampToRange(researchResult.settings.reverb)
          }
        }
        
        console.log('✅ Post-processed amp settings to 0-10 range')
        
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        console.error('Raw output text:', outputText)
        
        // Try to extract data from formatted text response
        console.log('🔄 Attempting to extract data from formatted text...')
        try {
          // Extract gear information
          const guitarMatch = outputText.match(/\*\*Guitar:\*\*\s*([^\n]+)/i)
          const pickupsMatch = outputText.match(/\*\*Pickups:\*\*\s*([^\n]+)/i)
          const ampMatch = outputText.match(/\*\*Amplifier:\*\*\s*([^\n]+)/i)
          const notesMatch = outputText.match(/\*\*Notes:\*\*\s*([^\n]+)/i)
          
          // Extract settings
          const gainMatch = outputText.match(/\*\*Gain:\*\*\s*([0-9]+)/i)
          const bassMatch = outputText.match(/\*\*Bass:\*\*\s*([0-9]+)/i)
          const midMatch = outputText.match(/\*\*Mid:\*\*\s*([0-9]+)/i)
          const trebleMatch = outputText.match(/\*\*Treble:\*\*\s*([0-9]+)/i)
          const presenceMatch = outputText.match(/\*\*Presence:\*\*\s*([^\n]+)/i)
          const reverbMatch = outputText.match(/\*\*Reverb:\*\*\s*([0-9]+)/i)
          
          // Extract citations
          const citations: Citation[] = []
          const urlMatches = outputText.match(/\(([^)]+)\)/g)
          if (urlMatches) {
            urlMatches.forEach(match => {
              const url = match.replace(/[()]/g, '')
              if (url.includes('http')) {
                citations.push({
                  title: url.split('/').pop() || 'Source',
                  url: url
                })
              }
            })
          }
          
          // Extract confidence
          const confidenceMatch = outputText.match(/Confidence:\s*([0-9.]+)/i)
          const confidence = confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.8
          
          // Extract warnings
          const warnings: string[] = []
          const warningsMatch = outputText.match(/\*\*Warnings:\*\*([\s\S]*?)(?=\*\*|$)/i)
          if (warningsMatch) {
            const warningsText = warningsMatch[1]
            const warningLines = warningsText.split('\n').filter(line => line.trim().startsWith('-'))
            warningLines.forEach(line => {
              const warning = line.replace(/^-\s*/, '').trim()
              if (warning) warnings.push(warning)
            })
          }
          
          // Helper function to clamp values to 0-10 range
          const clampToRange = (value: number): number => Math.max(0, Math.min(10, value))
          
          // Build the result object
          researchResult = {
            original_gear: {
              guitar: guitarMatch ? guitarMatch[1].trim() : 'Unknown',
              pickups: pickupsMatch ? pickupsMatch[1].trim() : 'Unknown',
              amp: ampMatch ? ampMatch[1].trim() : 'Unknown',
              notes: notesMatch ? notesMatch[1].trim() : ''
            },
            settings: {
              gain: gainMatch ? clampToRange(parseInt(gainMatch[1])) : 0,
              bass: bassMatch ? clampToRange(parseInt(bassMatch[1])) : 5,
              mid: midMatch ? clampToRange(parseInt(midMatch[1])) : 5,
              treble: trebleMatch ? clampToRange(parseInt(trebleMatch[1])) : 5,
              presence: presenceMatch ? (presenceMatch[1].toLowerCase().includes('not') ? undefined : clampToRange(5)) : 5,
              reverb: reverbMatch ? clampToRange(parseInt(reverbMatch[1])) : 0
            },
            section_profile: {
              distortion: gainMatch && parseInt(gainMatch[1]) <= 2 ? "clean" : "crunch",
              confidence: 0.6,
              evidence_phrases: ["Fallback classification based on gain settings"]
            },
            citations,
            confidence,
            warnings,
            song: body.song,
            artist: body.artist || 'Unknown Artist'
          }
          
          console.log('✅ Successfully extracted data from formatted text')
          
        } catch (extractError) {
          console.error('Failed to extract data from text:', extractError)
          throw new Error('Could not parse JSON response from web search')
        }
      }
      console.log('✅ Responses API with web search successful')

    } catch (error: any) {
      console.error('Responses API with web search failed:', error.message)
      // Fallback: Use Chat Completions with reasoning-based tone generation
      console.log('🔄 Falling back to reasoning-based tone generation...')
      try {
        const fallbackResponse = await client.chat.completions.create({
          model: 'gpt-4o', // Use gpt-4o for better reasoning
          messages: [
            {
              role: 'system',
              content: `You are an expert guitar tone analyst. Based on your knowledge of guitar gear, amps, and tone characteristics, analyze the requested song and create realistic amp settings that would achieve the desired tone. Consider the guitar type, amp type, and playing style.

IMPORTANT: For guitar knob settings, always try to find specific numbers from research. If you can't find specific settings, use realistic ranges based on the tone type:
- Clean tones: volume 5-7, tone 6-8
- Overdriven tones: volume 7-9, tone 5-7  
- Distorted tones: volume 8-10, tone 4-6
- Avoid generic terms like "full", "high", "low"

IMPORTANT GAIN GUIDELINES:
- Clean tones: Set gain to 0 or very low (1-2)
- Light overdrive: Set gain to 2-4
- Medium distortion: Set gain to 4-7
- Heavy distortion: Set gain to 7-10
- Consider the musical style, era, and tone characteristics

GAIN RULES:
- If the tone is clean, set gain to 0
- If the tone has light overdrive, set gain to 1-2
- If the tone is distorted, set gain to 3-10
- Always prioritize clean tone detection and set gain to 0 when appropriate

SECTION CLASSIFICATION:
Classify the requested SECTION's distortion level as one of:
- "clean" | "edge" | "crunch" | "high-gain"
Only mark "clean" if you have strong evidence this section uses a clean/no-drive guitar sound. Otherwise choose edge/crunch/high-gain based on the musical style and era.

Return ONLY a valid JSON object with the following structure: {"original_gear": {"guitar": "string", "pickups": "string", "amp": "string", "notes": "string?"}, "settings": {"gain": number?, "bass": number?, "mid": number?, "treble": number?, "presence": number?, "reverb": number?}, "guitar_knob_settings": {"volume": "string (e.g., '7', '8-9')", "tone": "string (e.g., '6', '7-8')"}, "section_profile": {"distortion": "clean" | "edge" | "crunch" | "high-gain", "confidence": number, "evidence_phrases": ["string"]}, "citations": [{"title": "string", "url": "string"}], "confidence": number, "warnings": ["string"], "song": "string", "artist": "string"}. Do not include any text before or after the JSON.`
            },
            {
              role: 'user',
              content: `Analyze the guitar tone for "${body.song}" by ${body.artist || 'unknown artist'} - ${body.part} section. 

SEARCH FOR SPECIFIC INFORMATION:
- Exact amp settings and knob positions for this song
- Guitar volume and tone knob settings (be specific: "volume at 7", "tone at 6", not just "full")
- Pickup selector positions
- Guitar rig rundowns and gear interviews
- Amp settings guides and tone tutorials
- Official gear lists and studio notes

IMPORTANT: For guitar knob settings, be specific with numbers (e.g., "volume at 7", "tone at 6") rather than generic terms like "full" or "high". If specific settings aren't found, use realistic defaults like "volume: 7-8", "tone: 6-7".

GUITAR KNOB SETTINGS GUIDELINES:
- Volume: Usually 7-10 for most tones, 5-7 for clean tones
- Tone: Usually 5-8 for most tones, 6-8 for clean tones
- Be specific with numbers when possible
- Avoid generic terms like "full", "high", "low"

If you find specific amp settings for this exact song, use them. If not, create realistic settings based on the typical gear and style. Pay special attention to whether this is a clean or distorted tone and set gain accordingly.

IMPORTANT: Use the exact song and artist names as found in your research. If the user made typos, correct them based on the actual song/artist names found online.

Return ONLY valid JSON.`
            }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3, // Lower temperature for more consistent reasoning
          max_tokens: 2000
        })
        const fallbackContent = fallbackResponse.choices?.[0]?.message?.content
        if (!fallbackContent) { throw new Error('No content in fallback response') }
        researchResult = JSON.parse(fallbackContent)
        mode = 'hypothesis'
        confidence = Math.min(researchResult.confidence || 0.7, 0.7)
        researchResult.confidence = confidence
        researchResult.warnings = [
          'This is a reasoning-based analysis, not web research',
          'Settings are based on typical gear characteristics for this style',
          'Accuracy may vary from the original recording',
          ...(researchResult.warnings || [])
        ]
        console.log('✅ Reasoning-based fallback successful')
      } catch (fallbackError: any) {
        console.error('Fallback also failed:', fallbackError.message)
        throw new Error(`Both web search and reasoning fallback failed: ${fallbackError.message}`)
      }
    }

    // Post-process to ensure gain is set to 0 for clean tones
    if (researchResult?.settings?.gain !== undefined) {
      const gain = researchResult.settings.gain
      const notes = researchResult.original_gear?.notes?.toLowerCase() || ''
      const warnings = researchResult.warnings?.join(' ').toLowerCase() || ''
      
      // More aggressive clean tone detection
      const isCleanTone = gain <= 2 || 
                         notes.includes('clean') || 
                         notes.includes('no distortion') ||
                         notes.includes('no overdrive') ||
                         warnings.includes('clean') ||
                         warnings.includes('no distortion') ||
                         warnings.includes('no overdrive') ||
                         researchResult.song?.toLowerCase().includes('clean') ||
                         (gain <= 3 && (notes.includes('slight') || notes.includes('light')))
      
      if (isCleanTone && gain > 0) {
        console.log(`Adjusting gain from ${gain} to 0 for clean tone`)
        researchResult.settings.gain = 0
        researchResult.warnings = [
          'Gain adjusted to 0 for clean tone',
          ...(researchResult.warnings || [])
        ]
      }
    }

    // Post-process to handle null values and default guitar knob settings
    if (researchResult?.settings) {
      // Set null presence/reverb to 0
      if (researchResult.settings.presence === null || researchResult.settings.presence === undefined) {
        researchResult.settings.presence = 0
      }
      if (researchResult.settings.reverb === null || researchResult.settings.reverb === undefined) {
        researchResult.settings.reverb = 0
      }
    }

    // Clean up guitar knob settings if they exist but are generic
    if (researchResult?.guitar_knob_settings) {
      // Clean up guitar knob settings
      if (researchResult.guitar_knob_settings.volume === "Full" || researchResult.guitar_knob_settings.volume === "full") {
        researchResult.guitar_knob_settings.volume = "8-10"
      }
      if (researchResult.guitar_knob_settings.tone === "Full" || researchResult.guitar_knob_settings.tone === "full") {
        researchResult.guitar_knob_settings.tone = "7-8"
      }
    }

    // Validate the structured output
    if (!researchResult.original_gear || !researchResult.settings || !researchResult.citations || typeof researchResult.confidence !== 'number') {
      console.error('Invalid structured output format:', researchResult)
      return Response.json(
        { ok: false, error: 'Invalid response format from OpenAI' },
        { status: 502 }
      )
    }

    // Store in cache
    const { error: storeError } = await setResearchCache(
      key,
      researchResult,
      researchResult.confidence,
      researchResult.citations,
      mode
    )

    if (storeError) {
      console.error('Failed to store in cache:', storeError)
      // Don't fail the request, just log the error
    }

    // Return the research result
    return Response.json({
      ok: true,
      data: researchResult,
      cached: false,
      mode: mode
    })

  } catch (error) {
    console.error('Research tone API error:', error)
    
    if (error instanceof SyntaxError) {
      return Response.json(
        { ok: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }
    
    return Response.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
