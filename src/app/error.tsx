'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error caught by error boundary:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-6xl mb-4">🎸</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600">
            We&apos;re experiencing some technical difficulties. Don&apos;t worry, it&apos;s not your fault!
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-glow mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">What you can do:</h2>
          <div className="space-y-3">
            <Button 
              onClick={reset}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              🔄 Try Again
            </Button>
            
            <Link href="/status">
              <Button 
                variant="outline" 
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                📊 Check System Status
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <p>If the problem persists, try refreshing the page or coming back later.</p>
          <p className="mt-1">Error ID: {error.digest || 'unknown'}</p>
        </div>
      </div>
    </div>
  )
}
