export default function StatusPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow animate-bounce-gentle">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">System Status</h1>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 border border-green-200 text-green-800 font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse-gentle"></span>
            All Systems Operational
          </div>
          <p className="text-gray-600 mt-4">
            ToneMatch.ai is running smoothly and ready to help you match tones.
          </p>
        </div>
      </div>
    </div>
  )
}
