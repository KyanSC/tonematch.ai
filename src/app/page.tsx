import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Interactive Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"></div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center animate-fade-in">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 text-sm font-medium text-blue-700 mb-6 animate-slide-down glow-on-hover">
              AI-Powered Tone Matching
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            <span className="gradient-text">Match Any</span>
            <br />
            <span className="text-gray-900">Guitar Tone</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Transform any guitar tone to match your gear. AI-powered analysis that adapts legendary sounds to your setup.
          </p>
          
          <div className="flex items-center justify-center mb-16 animate-slide-up">
            <Link href="/app">
              <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-glow-lg hover:shadow-glow transition-all duration-300 transform hover:scale-105 magnetic glow-on-hover">
                Start Matching Tones
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-2xl glass shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in float-card interactive-hover">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Smart Analysis</h3>
            <p className="text-gray-600">AI analyzes original recordings to identify gear, settings, and techniques used.</p>
          </div>
          
          <div className="text-center p-8 rounded-2xl glass shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in float-card interactive-hover">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Gear Adaptation</h3>
            <p className="text-gray-600">Intelligently adapts settings to work with your specific guitar and amp combination.</p>
          </div>
          
          <div className="text-center p-8 rounded-2xl glass shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in float-card interactive-hover">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Instant Results</h3>
            <p className="text-gray-600">Get detailed settings and recommendations in seconds, not hours of trial and error.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center">
          <div className="max-w-4xl mx-auto p-12 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-glow-lg interactive-hover">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Sound?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of guitarists who are already matching legendary tones with their gear.
            </p>
            <Link href="/app">
              <Button size="lg" className="text-lg px-8 py-4 !bg-white !text-blue-600 hover:!bg-gray-50 hover:!text-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 magnetic glow-on-hover font-semibold">
                Start Your Tone Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
