'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/toast'

// TypeScript types matching the API schema
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
  title?: string
  url?: string
  name?: string
}

interface ResearchResult {
  original_gear: OriginalGear
  settings: AmpSettings
  citations: Citation[]
  confidence: number
  warnings: string[]
  song?: string
  artist?: string
  guitar_knob_settings?: {
    volume: string;
    tone: string;
  };
}

interface ResearchResponse {
  ok: boolean
  data?: ResearchResult
  cached?: boolean
  cached_at?: string
  mode?: 'authoritative' | 'hypothesis'
  error?: string
}

export default function AppPage() {
  const { showToast } = useToast()
  
  // Local state management
  const [song, setSong] = useState('')
  const [artist, setArtist] = useState('')
  const [part, setPart] = useState<'riff' | 'solo'>('riff')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [research, setResearch] = useState<ResearchResult | null>(null)
  const [isCached, setIsCached] = useState(false)
  const [researchMode, setResearchMode] = useState<'authoritative' | 'hypothesis'>('authoritative')
  
  // Gear selection state
  const [guitarLabel, setGuitarLabel] = useState('')
  const [ampLabel, setAmpLabel] = useState('')
  const [features, setFeatures] = useState({
    coilSplit: false,
    presence: false,
    reverb: false,
    fxLoop: false
  })
  
  // Adaptation state
  const [adapting, setAdapting] = useState(false)
  const [adaptation, setAdaptation] = useState<any>(null)
  const [adaptError, setAdaptError] = useState<string | null>(null)

  const handleRunResearch = async () => {
    if (!song.trim()) {
      showToast('Please enter a song title', 'error')
      return
    }

    setLoading(true)
    setError(null)
    setIsCached(false)
    setResearchMode('authoritative')

    try {
      const response = await fetch('/api/research-tone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          song: song.trim(), 
          artist: artist.trim(),
          part 
        })
      })

      const data: ResearchResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to research tone')
      }

      if (data.ok && data.data) {
        // Debug: Log the actual response structure
        
        
        setResearch(data.data)
        setIsCached(data.cached || false)
        setResearchMode(data.mode || 'authoritative')
        
        const modeText = data.mode === 'hypothesis' ? ' (hypothesis)' : ''
        showToast(data.cached ? 'Research loaded from cache' + modeText : 'Research completed' + modeText, 'success')
        
        // Auto-adapt tone if gear is selected
        if (guitarLabel && ampLabel) {
          await handleAdaptTone(data.data)
        }
      } else {
        throw new Error(data.error || 'Invalid response from server')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAdaptTone = async (researchData: ResearchResult) => {
    if (!guitarLabel || !ampLabel) {
      showToast('Please select your guitar and amp first', 'error')
      return
    }

    setAdapting(true)
    setAdaptError(null)
    setAdaptation(null)

    try {
      const response = await fetch('/api/adapt-tone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          song: researchData.song || song,
          artist: researchData.artist || artist,
          part,
          original: {
            gear: researchData.original_gear,
            settings: researchData.settings,
            guitar_knob_settings: researchData.guitar_knob_settings
          },
          guitarLabel,
          ampLabel,
          features,
          originalTechnique: []
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to adapt tone')
      }

      if (data.ok && data.data) {
        setAdaptation(data.data)
        showToast('Tone adapted to your gear!', 'success')
      } else {
        throw new Error(data.error || 'Invalid adaptation response')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setAdaptError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setAdapting(false)
    }
  }









  return (
    <div className="container mx-auto px-4 py-8 max-w-[900px]">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">ToneMatch.ai</h1>
        <p className="text-gray-600">Research and adapt any guitar tone to your gear</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
            <div className="ml-2 text-sm font-medium">Your Gear</div>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
            <div className="ml-2 text-sm font-medium">Song & Artist</div>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
            <div className="ml-2 text-sm font-medium text-gray-500">Results</div>
          </div>
        </div>
      </div>

      {/* Step 1: Your Gear */}
      <Card className="mb-6 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</span>
            Your Gear
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Choose Guitar Archetype</label>
                <Select value={guitarLabel} onChange={(e) => {
                  setGuitarLabel(e.target.value)
                  // Auto-adapt if research is complete and amp is selected
                  if (e.target.value && ampLabel && research) {
                    handleAdaptTone(research)
                  }
                }}>
                  <option value="">Select guitar type...</option>
                  <option value="les-paul">Les Paul</option>
                  <option value="stratocaster">Stratocaster</option>
                  <option value="telecaster">Telecaster</option>
                  <option value="sg">SG</option>
                  <option value="es-335">ES-335</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Choose Amp Archetype</label>
                <Select value={ampLabel} onChange={(e) => {
                  setAmpLabel(e.target.value)
                  // Auto-adapt if research is complete and guitar is selected
                  if (e.target.value && guitarLabel && research) {
                    handleAdaptTone(research)
                  }
                }}>
                  <option value="">Select amp type...</option>
                  <option value="marshall">Marshall</option>
                  <option value="fender">Fender</option>
                  <option value="vox">Vox</option>
                  <option value="mesa">Mesa Boogie</option>
                  <option value="orange">Orange</option>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Available Features</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={features.coilSplit}
                      onChange={(e) => setFeatures(prev => ({ ...prev, coilSplit: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="ml-2 text-sm text-gray-700">Coil-split available</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={features.presence}
                      onChange={(e) => setFeatures(prev => ({ ...prev, presence: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="ml-2 text-sm text-gray-700">Presence control available</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={features.reverb}
                      onChange={(e) => setFeatures(prev => ({ ...prev, reverb: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="ml-2 text-sm text-gray-700">Reverb available</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={features.fxLoop}
                      onChange={(e) => setFeatures(prev => ({ ...prev, fxLoop: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="ml-2 text-sm text-gray-700">Effects loop available</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Song & Part */}
      <Card className="mb-6 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</span>
            Song & Part
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Song Title</label>
              <Input
                placeholder="e.g., Sweet Child O Mine"
                value={song}
                onChange={(e) => setSong(e.target.value)}
                className="h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Artist</label>
              <Input
                placeholder="e.g., Guns N' Roses"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Part</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="part"
                    value="riff"
                    checked={part === 'riff'}
                    onChange={(e) => setPart(e.target.value as 'riff' | 'solo')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Riff</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="part"
                    value="solo"
                    checked={part === 'solo'}
                    onChange={(e) => setPart(e.target.value as 'riff' | 'solo')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Solo</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Run Button */}
      <div className="text-center mb-8">
        <Button
          onClick={handleRunResearch}
          disabled={loading || !song.trim()}
          size="xl"
          className="px-8 py-4 text-lg"
        >
          {loading ? (
            <>
              <Spinner className="mr-2" />
              Researching...
            </>
          ) : (
            `Run Research${research?.song || song ? ` for "${research?.song || song}"` : ''}${research?.artist || artist ? ` by ${research?.artist || artist}` : ''}`
          )}
        </Button>
      </div>

      {/* Step 3: Results */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Original Tone Card */}
        <Card className="animate-fade-in bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-xl pb-6 shadow-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3 animate-pulse">🎵</span>
                <div>
                  <span className="text-xl font-bold">Original Tone</span>
                  <div className="text-sm opacity-90 mt-1">
                    {research?.song || song} {research?.artist || artist ? `by ${research?.artist || artist}` : ''}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {researchMode === 'hypothesis' && (
                  <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full font-medium border border-white/30 animate-pulse">
                    reasoning
                  </span>
                )}
                {isCached && (
                  <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full font-medium border border-white/30">
                    cached
                  </span>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-8">
            {research ? (
              <div className="space-y-6">
                {(() => {
                  try {
                    return (
                      <>
                        {/* Gear Information */}
                        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-blue-100 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center mb-3">
                            <span className="text-blue-600 mr-2">🎸</span>
                            <h4 className="font-semibold text-gray-800">Original Gear</h4>
                          </div>
                          <div className="grid grid-cols-1 gap-3 text-sm">
                            <div className="flex justify-between items-center py-2 px-3 bg-white/60 rounded-lg border border-blue-200/50 hover:bg-white/80 transition-all duration-200">
                              <span className="text-gray-600 font-medium">Guitar</span>
                              <span className="font-semibold text-gray-800 text-right">{String(research.original_gear?.guitar || 'Unknown')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 px-3 bg-white/60 rounded-lg border border-blue-200/50 hover:bg-white/80 transition-all duration-200">
                              <span className="text-gray-600 font-medium">Pickups</span>
                              <span className="font-semibold text-gray-800 text-right">{String(research.original_gear?.pickups || 'Unknown')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 px-3 bg-white/60 rounded-lg border border-blue-200/50 hover:bg-white/80 transition-all duration-200">
                              <span className="text-gray-600 font-medium">Amp</span>
                              <span className="font-semibold text-gray-800 text-right">{String(research.original_gear?.amp || 'Unknown')}</span>
                            </div>
                            {research.original_gear?.notes && (
                              <div className="flex justify-between items-start py-2 px-3 bg-white/60 rounded-lg border border-blue-200/50 hover:bg-white/80 transition-all duration-200">
                                <span className="text-gray-600 font-medium">Notes</span>
                                <span className="font-semibold text-gray-800 text-right max-w-xs">{String(research.original_gear.notes)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Settings */}
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <span className="text-emerald-600 mr-2">🔊</span>
                              <h4 className="font-semibold text-gray-800">Amp Settings</h4>
                            </div>
                            <div className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                              Original
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(research.settings || {}).map(([key, value]) => (
                              <div key={key} className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-emerald-200/50 hover:bg-white/80 hover:shadow-md transition-all duration-200">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{key}</span>
                                  <span className="text-lg font-bold text-emerald-700">{String(value)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-gradient-to-r from-emerald-400 to-teal-500 h-1.5 rounded-full transition-all duration-500"
                                    style={{ width: `${(Number(value) / 10) * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Guitar Knob Settings */}
                        {research.guitar_knob_settings && (
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <span className="text-purple-600 mr-2">🎸</span>
                                <h4 className="font-semibold text-gray-800">Guitar Controls</h4>
                              </div>
                              <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                                Original
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-200/50 hover:bg-white/80 hover:shadow-md transition-all duration-200">
                                <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Volume</div>
                                <div className="text-sm font-semibold text-purple-700">{String(research.guitar_knob_settings.volume)}</div>
                              </div>
                              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-200/50 hover:bg-white/80 hover:shadow-md transition-all duration-200">
                                <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Tone</div>
                                <div className="text-sm font-semibold text-purple-700">{String(research.guitar_knob_settings.tone)}</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Confidence */}
                        {research.confidence && (
                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center mb-3">
                              <span className="text-amber-600 mr-2">📊</span>
                              <h4 className="font-semibold text-gray-800">Confidence</h4>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-600">Research Accuracy</span>
                              <span className="text-lg font-bold text-amber-700">{Math.round(research.confidence * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${research.confidence * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Warnings */}
                        {research.warnings && research.warnings.length > 0 && (
                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center mb-3">
                              <span className="text-yellow-600 mr-2">⚠️</span>
                              <h4 className="font-semibold text-gray-800">Warnings</h4>
                            </div>
                            <div className="space-y-2">
                              {research.warnings.map((warning, index) => (
                                <div key={index} className="flex items-start text-sm">
                                  <span className="text-yellow-500 mr-2 mt-0.5">•</span>
                                  <span className="text-gray-700">{String(warning)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Citations */}
                        {research.citations && research.citations.length > 0 && (
                          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center mb-3">
                              <span className="text-indigo-600 mr-2">📚</span>
                              <h4 className="font-semibold text-gray-800">Sources</h4>
                            </div>
                            <div className="space-y-2">
                              {research.citations.map((citation, index) => {
                                if (!citation || typeof citation !== 'object') return null
                                
                                const title = citation.title || citation.name || 'Unknown source'
                                const url = citation.url || '#'
                                
                                return (
                                  <a
                                    key={index}
                                    href={String(url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors bg-white/60 rounded-lg p-2 hover:bg-white/80"
                                  >
                                    {String(title)}
                                  </a>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    )
                  } catch (error) {
                    console.error('Error rendering research data:', error)
                    return (
                      <div className="text-center py-8 text-red-600">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h3 className="text-lg font-semibold mb-2">Display Error</h3>
                        <p className="text-sm">Error displaying research results. Please try again.</p>
                      </div>
                    )
                  }
                })()}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-6 opacity-60">🎵</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to Research</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  Enter a song and click &quot;Run Research&quot; to see the original tone details
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Your Adapted Tone Card */}
        <Card className="animate-fade-in bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-xl pb-6 shadow-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3 animate-pulse">🎯</span>
                <span className="text-xl font-bold">Your Adapted Tone</span>
              </div>
              {adaptation && (
                <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full font-medium border border-white/30">
                  {Math.round(adaptation.confidence * 100)}% confidence
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-8">
            {adapting ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-6 opacity-60 animate-pulse">⚙️</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Adapting Tone</h3>
                <p className="text-sm text-gray-500">Analyzing your gear and adapting settings...</p>
              </div>
            ) : adaptation ? (
              <div className="space-y-6">
                {/* Pickup Choice */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center mb-2">
                    <span className="text-blue-600 mr-2">🎛️</span>
                    <h4 className="font-semibold text-gray-800">Pickup Choice</h4>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{adaptation.pickup_choice}</p>
                </div>

                {/* Amp Settings */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-emerald-600 mr-2">🔊</span>
                      <h4 className="font-semibold text-gray-800">Amp Settings</h4>
                    </div>
                    <div className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                      Adapted
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(adaptation.amp_settings).map(([key, value]) => (
                      <div key={key} className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-emerald-200/50 hover:bg-white/80 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{key}</span>
                          <span className="text-lg font-bold text-emerald-700">{String(value)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-emerald-400 to-teal-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${(Number(value) / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guitar Knob Tweaks */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center mb-3">
                    <span className="text-purple-600 mr-2">🎸</span>
                    <h4 className="font-semibold text-gray-800">Guitar Controls</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-200/50 hover:bg-white/80 hover:shadow-md transition-all duration-200">
                      <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Volume</div>
                      <div className="text-sm font-semibold text-purple-700">{adaptation.guitar_knob_tweaks.volume}</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-200/50 hover:bg-white/80 hover:shadow-md transition-all duration-200">
                      <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Tone</div>
                      <div className="text-sm font-semibold text-purple-700">{adaptation.guitar_knob_tweaks.tone}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : adaptError ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-6 opacity-60">⚠️</div>
                <h3 className="text-lg font-semibold text-red-600 mb-2">Adaptation Failed</h3>
                <p className="text-sm text-red-500 max-w-sm mx-auto">
                  {adaptError}
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-6 opacity-60">🎸</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to Adapt</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  Select your gear and run research to see your personalized tone settings
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
