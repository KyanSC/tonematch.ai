import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-6xl mb-4">🎵</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-600">
            Looks like this tone doesn&apos;t exist yet! The page you&apos;re looking for has wandered off.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-glow mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Let&apos;s get you back on track:</h2>
          <div className="space-y-3">
            <Link href="/app">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                🎸 Back to App
              </Button>
            </Link>
            
            <Link href="/">
              <Button 
                variant="outline" 
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                🏠 Go Home
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <p>Error 404 - The requested page could not be found</p>
        </div>
      </div>
    </div>
  )
}
