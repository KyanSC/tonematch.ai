import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <Link 
            href="/" 
            className="text-2xl font-bold gradient-text hover:scale-105 transition-transform duration-200"
          >
            ToneMatch.ai
          </Link>

          {/* Center - Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 hover:underline"
            >
              Home
            </Link>
            <Link 
              href="/app" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 hover:underline"
            >
              App
            </Link>
            <Link 
              href="/status" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 hover:underline"
            >
              Status
            </Link>
          </div>

          {/* Right side - Legal links */}
          <div className="flex items-center space-x-6">
            <Link 
              href="/privacy" 
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
