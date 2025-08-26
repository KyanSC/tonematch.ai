import { NextRequest } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

// TypeScript types for the API
interface AdaptToneRequest {
  song: string
  artist?: string
  part: 'riff' | 'solo'
  original: {
    gear: {
      guitar: string
      pickups: string
      amp: string
      notes?: string
    }
    settings: any
    guitar_knob_settings?: {
      volume: string
      tone: string
    }
  }
  originalSectionProfile?: {
    distortion?: "clean" | "edge" | "crunch" | "high-gain"
    confidence?: number
    evidence_phrases?: string[]
  }
  guitarLabel: string
  ampLabel: string
  features?: {
    coilSplit?: boolean
    presence?: boolean
    reverb?: boolean
    fxLoop?: boolean
  }
  originalTechnique?: Array<{ text: string; source_url?: string }> | string[]
}

interface AdaptToneResponse {
  pickup_choice: string
  amp_settings: {
    gain: number
    bass: number
    mid: number
    treble: number
    presence?: number
    reverb?: number
  }
  guitar_knob_tweaks: {
    volume: string
    tone: string
  }
  playing_tips: string[]
  technique_notes: string[]
  confidence: number
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body: AdaptToneRequest = await request.json()
    
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

    if (!body.guitarLabel || !body.ampLabel) {
      return Response.json(
        { ok: false, error: 'Guitar and amp labels are required' },
        { status: 400 }
      )
    }

    // Validate OpenAI configuration
    const openaiApiKey = process.env.OPENAI_API_KEY
    const openaiModel = process.env.OPENAI_MODEL_ADAPT
    
    if (!openaiApiKey) {
      console.error('Missing OPENAI_API_KEY environment variable')
      return Response.json(
        { ok: false, error: 'Server not configured' },
        { status: 503 }
      )
    }
    
    if (!openaiModel) {
      console.error('Missing OPENAI_MODEL_ADAPT environment variable')
      return Response.json(
        { ok: false, error: 'Server not configured' },
        { status: 503 }
      )
    }

    const client = new OpenAI({ apiKey: openaiApiKey })

    // Call OpenAI for tone adaptation
    const response = await client.chat.completions.create({
      model: openaiModel,
      messages: [
        {
          role: 'system',
          content: `You are a tone adaptation expert. Given (A) ORIGINAL tone + technique for a specific song section and (B) the PLAYER's gear, output adapted settings that compensate for differences only where needed.

Non-negotiables
- Do NOT mirror the original numbers. Compute changes from concrete deltas (pickup type/output/position, guitar build/scale, amp family voicing, available controls). If no delta warrants a change for a knob, KEEP the original numeric value.
- Output ONLY JSON matching our schema. Include ONLY knobs the player actually has (gain/bass/mid/treble; presence only if available; reverb only if available). Omit unknowns instead of guessing. Integers 0–10.
- Only set gain=0 if ORIGINAL reported gain=0 AND originalSectionProfile.distortion === "clean". Otherwise, compute gain normally from gear deltas.
- Technique fidelity: you will receive \`originalTechnique\` (bullets from research). Treat these as ground truth for how the guitarist plays this section (e.g., "fingerstyle, no pick", "Strat position 2/4"). **Never contradict them.**

COIL-SPLIT RULES (CRITICAL):
- ONLY use coil-split when the ORIGINAL guitar has SINGLE COIL pickups and your guitar has HUMBUCKERS
- If both original and your guitar have humbuckers, DO NOT coil-split - use the full humbucker
- If both original and your guitar have single coils, DO NOT coil-split
- Coil-split is ONLY for emulating single coil tone from humbuckers, not for general tone shaping
- Examples: Original Strat (single coils) → Your Les Paul (humbuckers) = use coil-split
- Examples: Original Les Paul (humbuckers) → Your Les Paul (humbuckers) = NO coil-split

What to consider (qualitative, flexible)
- Pickup/output + position differences (HB↔SC, P90 ≈ mid; preserve pickup POSITION if possible).
- Guitar construction/scale (LP/mahogany = thicker/darker; Strat/long scale = brighter/snappier).
- Amp family voicing translation (Fender scooped ↔ Marshall/Vox mid-forward; modern high-gain ↔ classic crunch).
- Presence vs treble synergy (no presence → subtle treble compensation; if harsh and presence exists → reduce presence before treble).
- Reverb: prefer preserving the original value; change only if your rig translation clearly requires it, and state why.

Explanations: list only changes you actually made and the reason for each (e.g., "HB→SC target: −2 gain, +1 treble", "Fender→mid-forward: +2 mids, −1 bass"). If a control was kept the same for a reason, include a short bullet like "kept bass to avoid flub on 4x12".

Also include \`technique_notes\` (3–5 concise bullets) that repeat or refine the guitarist-only facts from \`originalTechnique\`, adapted to the player's rig (e.g., preserve "fingerstyle, no pick"; note pickup selector position). No advice language, no bandmates.

OUTPUT fields:
- pickup_choice: specific pickup selector position (e.g., "Bridge pickup", "Neck pickup", "Bridge + Neck", "Middle pickup", "Bridge + Middle", "Neck + Middle", "All three pickups", "Coil-split bridge", "Coil-split neck"). Focus on the pickup selector position, not playing technique. Only use coil-split when emulating single coil from humbuckers.
- amp_settings: only include knobs the player actually has; integers 0–10.
- guitar_knob_tweaks: volume/tone guidance (e.g., "vol ~8 for edge-of-breakup").
- playing_tips: 3–5 specific playing technique tips based on the original guitarist's style for this song/part (e.g., "Use palm muting for tight rhythm", "Pick near the bridge for brightness", "Alternate pick for fast runs", "Use hybrid picking for complex parts").
- technique_notes: 3–5 concise bullets that repeat or refine the guitarist-only facts from originalTechnique, adapted to the player's rig. No advice language, no bandmates.
- confidence: 0–1.`
        },
        {
          role: 'user',
          content: `Adapt the tone for "${body.song}" by ${body.artist || 'unknown artist'} - ${body.part} section.

Original gear: ${body.original.gear.guitar} with ${body.original.gear.pickups} → ${body.original.gear.amp}
Original settings: ${JSON.stringify(body.original.settings)}
Original guitar knobs: ${body.original.guitar_knob_settings ? JSON.stringify(body.original.guitar_knob_settings) : 'Not specified'}
Original technique: ${body.originalTechnique ? JSON.stringify(body.originalTechnique) : 'No technique data available'}

Your gear: ${body.guitarLabel} → ${body.ampLabel}
Features: ${JSON.stringify(body.features || {})}

Return ONLY valid JSON with this structure:
{
  "pickup_choice": "string",
  "amp_settings": { "gain": number, "bass": number, "mid": number, "treble": number, "presence": number?, "reverb": number? },
  "guitar_knob_tweaks": { "volume": "string", "tone": "string" },
  "playing_tips": ["string"],
  "technique_notes": ["string"],
  "confidence": number
}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 1500
    })

    const content = response.choices?.[0]?.message?.content
    if (!content) {
      throw new Error('No content in OpenAI response')
    }

    const adaptResult: AdaptToneResponse = JSON.parse(content)

    // Helper function to parse original gain value
    const parseOriginalGain = (originalSettings: any): number => {
      const gain = originalSettings?.gain
      if (gain === undefined || gain === null) return 0
      
      // Handle string values like "0(clean)"
      if (typeof gain === 'string') {
        const match = gain.match(/^(\d+)/)
        return match ? Math.max(0, Math.min(10, parseInt(match[1]))) : 0
      }
      
      // Handle numeric values
      return Math.max(0, Math.min(10, Math.round(Number(gain))))
    }

    // Post-processing: enforce clean tone constraint with section profile
    const originalGain = parseOriginalGain(body.original.settings)
    console.log(`Original gain: ${originalGain}, Original settings:`, body.original.settings)
    console.log(`Section profile:`, body.originalSectionProfile)
    
    // Robust numeric parse for original gain, treating "0(clean)" as 0
    const og = parseFloat(String(body.original.settings?.gain).replace(/[^0-9.]/g,'') || 'NaN')
    const isZero = Number.isFinite(og) && og === 0
    const isClean = 
      (body.originalSectionProfile?.distortion === 'clean') ||
      (body.originalSectionProfile?.confidence && body.originalSectionProfile.confidence > 0.7 && 
       body.originalSectionProfile.evidence_phrases?.some(phrase => /clean|no.*distortion|no.*overdrive/i.test(phrase)))
    
    console.log(`Gain analysis: isZero=${isZero}, isClean=${isClean}, section_profile=${body.originalSectionProfile?.distortion}`)
    
    if (isZero && isClean) {
      console.log(`Original gain is 0 AND section is clean - forcing adapted gain to 0`)
      if (!adaptResult.amp_settings) {
        adaptResult.amp_settings = { gain: 0, bass: 5, mid: 5, treble: 5 }
      } else {
        adaptResult.amp_settings.gain = 0
      }
    } else if (isZero && !isClean) {
      console.log(`Original gain is 0 but section is NOT clean - allowing gear-based adaptation`)
    } else {
      console.log(`Original gain is ${originalGain} - allowing gear-based adaptation`)
    }

    // Technique alignment processing
    const originalTechniqueTexts = body.originalTechnique ? 
      (Array.isArray(body.originalTechnique) && typeof body.originalTechnique[0] === 'string' ? 
        body.originalTechnique : 
        body.originalTechnique.map((item: any) => item.text || item)
      ) : []
    
    console.log(`Original technique texts:`, originalTechniqueTexts)
    
    // Check for fingerstyle in original technique
    const hasFingerstyle = originalTechniqueTexts.some(text => 
      typeof text === 'string' && text.toLowerCase().includes('fingerstyle')
    )
    
    console.log(`Has fingerstyle:`, hasFingerstyle)
    console.log(`Original gain:`, originalGain)
    console.log(`Gear deltas - Original: ${body.original.gear.guitar} → Player: ${body.guitarLabel}, Original: ${body.original.gear.amp} → Player: ${body.ampLabel}`)
    
    if (hasFingerstyle) {
      console.log(`Original technique mentions fingerstyle - ensuring adaptation preserves this`)
      
      // Remove any adaptation bullets that suggest picks/picking
      if (adaptResult.playing_tips) {
        adaptResult.playing_tips = adaptResult.playing_tips.filter(tip => 
          !tip.toLowerCase().includes('pick') && 
          !tip.toLowerCase().includes('picking')
        )
      }
      
      // Ensure technique_notes includes fingerstyle
      if (adaptResult.technique_notes) {
        const hasFingerstyleNote = adaptResult.technique_notes.some(note => 
          note.toLowerCase().includes('fingerstyle')
        )
        if (!hasFingerstyleNote) {
          adaptResult.technique_notes.unshift('fingerstyle, no pick')
        }
      }
    }

    // Filter out band member references from explanations
    if (adaptResult.playing_tips) {
      adaptResult.playing_tips = adaptResult.playing_tips.filter(tip => 
        !tip.toLowerCase().includes('bassist') && 
        !tip.toLowerCase().includes('drummer') && 
        !tip.toLowerCase().includes('bandmate') &&
        !tip.toLowerCase().includes('band member')
      )
    }
    
    if (adaptResult.technique_notes) {
      console.log(`Original technique_notes:`, adaptResult.technique_notes)
      
      adaptResult.technique_notes = adaptResult.technique_notes.filter(note => 
        !note.toLowerCase().includes('bassist') && 
        !note.toLowerCase().includes('drummer') && 
        !note.toLowerCase().includes('bandmate') &&
        !note.toLowerCase().includes('band member') &&
        !note.toLowerCase().includes('flea') &&
        !note.toLowerCase().includes('bass guitar') &&
        !note.toLowerCase().includes('keys') &&
        !note.toLowerCase().includes('keyboard') &&
        !/\b(use|try|you should|aim to|consider)\b/i.test(note)
      )
      
      // Trim whitespace, dedupe, keep max 5 bullets
      adaptResult.technique_notes = Array.from(new Set(
        adaptResult.technique_notes
          .map(note => note.trim())
          .filter(note => note.length > 0)
      )).slice(0, 5)
      
      console.log(`Filtered technique_notes:`, adaptResult.technique_notes)
    }

    // Validate and clamp numbers to 0-10, round to integers
    if (adaptResult.amp_settings) {
      const clamp = (value: number) => Math.max(0, Math.min(10, Math.round(value)))
      adaptResult.amp_settings.gain = clamp(adaptResult.amp_settings.gain)
      adaptResult.amp_settings.bass = clamp(adaptResult.amp_settings.bass)
      adaptResult.amp_settings.mid = clamp(adaptResult.amp_settings.mid)
      adaptResult.amp_settings.treble = clamp(adaptResult.amp_settings.treble)
      
      // Only include presence if allowed by features
      if (adaptResult.amp_settings.presence !== undefined) {
        if (body.features?.presence) {
          adaptResult.amp_settings.presence = clamp(adaptResult.amp_settings.presence)
        } else {
          delete adaptResult.amp_settings.presence
        }
      }
      
      // Only include reverb if allowed by features
      if (adaptResult.amp_settings.reverb !== undefined) {
        if (body.features?.reverb) {
          adaptResult.amp_settings.reverb = clamp(adaptResult.amp_settings.reverb)
        } else {
          delete adaptResult.amp_settings.reverb
        }
      }
    }

    // Post-processing: enforce coil-split rules
    if (adaptResult.pickup_choice) {
      const originalPickups = body.original.gear.pickups.toLowerCase()
      const playerGuitar = body.guitarLabel.toLowerCase()
      
             // Check if both guitars have humbuckers
       const originalHasHumbuckers = originalPickups.includes('humbucker') || 
                                    originalPickups.includes('paf') || 
                                    originalPickups.includes('les paul') ||
                                    originalPickups.includes('lp') ||
                                    originalPickups.includes('les-paul')
       
       const playerHasHumbuckers = playerGuitar.includes('les paul') || 
                                  playerGuitar.includes('lp') || 
                                  playerGuitar.includes('humbucker') ||
                                  playerGuitar.includes('les-paul')
      
             // Check if both guitars have single coils
       const originalHasSingleCoils = originalPickups.includes('single coil') || 
                                     originalPickups.includes('single-coil') ||
                                     originalPickups.includes('strat') || 
                                     originalPickups.includes('telecaster') ||
                                     originalPickups.includes('tele') ||
                                     originalPickups.includes('fender')
       
       const playerHasSingleCoils = playerGuitar.includes('strat') || 
                                   playerGuitar.includes('telecaster') || 
                                   playerGuitar.includes('tele') ||
                                   playerGuitar.includes('single coil') ||
                                   playerGuitar.includes('single-coil') ||
                                   playerGuitar.includes('fender')
      
      console.log(`Coil-split analysis:`, {
        originalPickups,
        playerGuitar,
        originalHasHumbuckers,
        playerHasHumbuckers,
        originalHasSingleCoils,
        playerHasSingleCoils,
        currentPickupChoice: adaptResult.pickup_choice
      })
      
      // Rule: If both have humbuckers, remove coil-split
      if (originalHasHumbuckers && playerHasHumbuckers) {
        if (adaptResult.pickup_choice.toLowerCase().includes('coil-split')) {
          console.log(`Both guitars have humbuckers - removing coil-split recommendation`)
          adaptResult.pickup_choice = adaptResult.pickup_choice
            .replace(/coil-split bridge/i, 'Bridge pickup')
            .replace(/coil-split neck/i, 'Neck pickup')
            .replace(/coil-split/i, 'Bridge pickup')
        }
      }
      
      // Rule: If both have single coils, remove coil-split
      if (originalHasSingleCoils && playerHasSingleCoils) {
        if (adaptResult.pickup_choice.toLowerCase().includes('coil-split')) {
          console.log(`Both guitars have single coils - removing coil-split recommendation`)
          adaptResult.pickup_choice = adaptResult.pickup_choice
            .replace(/coil-split bridge/i, 'Bridge pickup')
            .replace(/coil-split neck/i, 'Neck pickup')
            .replace(/coil-split/i, 'Bridge pickup')
        }
      }
      
             // Rule: Only allow coil-split when going from single coil to humbucker
       if (!originalHasSingleCoils || !playerHasHumbuckers) {
         if (adaptResult.pickup_choice.toLowerCase().includes('coil-split')) {
           console.log(`Invalid coil-split scenario - removing coil-split recommendation`)
           adaptResult.pickup_choice = adaptResult.pickup_choice
             .replace(/coil-split bridge/i, 'Bridge pickup')
             .replace(/coil-split neck/i, 'Neck pickup')
             .replace(/coil-split/i, 'Bridge pickup')
         }
       }
       
       // Rule: Force coil-split when going from single coil to humbucker (if coil-split is available)
       if (originalHasSingleCoils && playerHasHumbuckers && body.features?.coilSplit) {
         const currentChoice = adaptResult.pickup_choice.toLowerCase()
         if (!currentChoice.includes('coil-split')) {
           console.log(`Original has single coils, player has humbuckers, coil-split available - forcing coil-split`)
           // Determine which pickup to coil-split based on the current choice
           if (currentChoice.includes('bridge')) {
             adaptResult.pickup_choice = 'Coil-split bridge'
           } else if (currentChoice.includes('neck')) {
             adaptResult.pickup_choice = 'Coil-split neck'
           } else {
             // Default to bridge coil-split for single coil emulation
             adaptResult.pickup_choice = 'Coil-split bridge'
           }
         }
       }
      
      console.log(`Final pickup choice after coil-split rules:`, adaptResult.pickup_choice)
    }

    // Ensure confidence is between 0-1
    adaptResult.confidence = Math.max(0, Math.min(1, adaptResult.confidence))

    return Response.json({
      ok: true,
      data: adaptResult
    })

  } catch (error: any) {
    console.error('Adapt tone error:', error)
    return Response.json(
      { ok: false, error: error.message || 'Failed to adapt tone' },
      { status: 500 }
    )
  }
}
