'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

type Step = 1 | 2 | 3

export default function AppPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [guitarArchetype, setGuitarArchetype] = useState('')
  const [ampArchetype, setAmpArchetype] = useState('')
  const [coilSplit, setCoilSplit] = useState(false)
  const [presenceControl, setPresenceControl] = useState(false)
  const [songTitle, setSongTitle] = useState('')
  const [partType, setPartType] = useState<'riff' | 'solo'>('riff')

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as Step)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-[900px]">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Tone Matching</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Let AI analyze and adapt any guitar tone to your specific gear setup
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-12 animate-slide-up">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                    step <= currentStep
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-glow'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-4 transition-all duration-300 ${
                    step < currentStep ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              {currentStep === 1 && 'Configure your gear'}
              {currentStep === 2 && 'Select the song and part'}
              {currentStep === 3 && 'Review and generate'}
            </p>
          </div>
        </div>

        {/* Step content */}
        <div className="animate-scale-in">
          {currentStep === 1 && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  Step 1: Your Gear Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Guitar Archetype
                    </label>
                    <Select
                      value={guitarArchetype}
                      onChange={(e) => setGuitarArchetype(e.target.value)}
                    >
                      <option value="">Choose Guitar Archetype</option>
                      <option value="strat">Stratocaster</option>
                      <option value="tele">Telecaster</option>
                      <option value="les-paul">Les Paul</option>
                      <option value="sg">SG</option>
                      <option value="prs">PRS</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Amp Archetype
                    </label>
                    <Select
                      value={ampArchetype}
                      onChange={(e) => setAmpArchetype(e.target.value)}
                    >
                      <option value="">Choose Amp Archetype</option>
                      <option value="fender">Fender</option>
                      <option value="marshall">Marshall</option>
                      <option value="vox">Vox</option>
                      <option value="mesa">Mesa Boogie</option>
                      <option value="orange">Orange</option>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-700">Additional Features</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={coilSplit}
                        onChange={(e) => setCoilSplit(e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Coil-split available</span>
                        <p className="text-xs text-gray-500">Humbucker to single-coil switching</p>
                      </div>
                    </label>
                    <label className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={presenceControl}
                        onChange={(e) => setPresenceControl(e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Presence control</span>
                        <p className="text-xs text-gray-500">High-frequency adjustment</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={handleNext} 
                    disabled={!guitarArchetype || !ampArchetype}
                    variant="gradient"
                    size="lg"
                  >
                    Continue
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  Step 2: Song & Part Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Song Title
                  </label>
                  <Input
                    placeholder="e.g., Sweet Child O' Mine, Stairway to Heaven..."
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Part Type
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className={`flex items-center p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      partType === 'riff' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="partType"
                        value="riff"
                        checked={partType === 'riff'}
                        onChange={(e) => setPartType(e.target.value as 'riff' | 'solo')}
                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Riff</span>
                        <p className="text-xs text-gray-500">Main guitar riff or rhythm part</p>
                      </div>
                    </label>
                    <label className={`flex items-center p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      partType === 'solo' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="partType"
                        value="solo"
                        checked={partType === 'solo'}
                        onChange={(e) => setPartType(e.target.value as 'riff' | 'solo')}
                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Solo</span>
                        <p className="text-xs text-gray-500">Lead guitar solo section</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handleBack} size="lg">
                    <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                  </Button>
                  <Button 
                    onClick={handleNext} 
                    disabled={!songTitle}
                    variant="gradient"
                    size="lg"
                  >
                    Continue
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <div className="space-y-8 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Step 3: Tone Analysis & Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <CardHeader>
                        <CardTitle className="text-blue-700">Original Tone Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-white/60 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-2">Gear Identified</h4>
                            <p className="text-sm text-gray-600">AI will research and identify the exact gear used in the original recording</p>
                          </div>
                          <div className="p-4 bg-white/60 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-2">Settings Analysis</h4>
                            <p className="text-sm text-gray-600">Detailed analysis of amp settings, effects, and playing techniques</p>
                          </div>
                          <div className="p-4 bg-white/60 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-2">Citations</h4>
                            <p className="text-sm text-gray-600">Sources and references for gear identification and settings</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                      <CardHeader>
                        <CardTitle className="text-purple-700">Your Adapted Tone</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-white/60 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-2">Optimized Settings</h4>
                            <p className="text-sm text-gray-600">Settings adapted specifically for your gear configuration</p>
                          </div>
                          <div className="p-4 bg-white/60 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-2">Alternative Options</h4>
                            <p className="text-sm text-gray-600">Multiple approaches to achieve similar tonal characteristics</p>
                          </div>
                          <div className="p-4 bg-white/60 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-2">Tips & Techniques</h4>
                            <p className="text-sm text-gray-600">Playing techniques and adjustments for best results</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                    <Button variant="outline" onClick={handleBack} size="lg">
                      <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back
                    </Button>
                    <div className="flex items-center space-x-4">
                      <Button disabled variant="gradient" size="lg">
                        <Spinner size="sm" className="mr-2" />
                        Generate Tone Match
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
