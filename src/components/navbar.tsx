import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link 
            href="/" 
            className="text-xl font-bold gradient-text hover:scale-105 transition-transform duration-200"
          >
            ToneMatch.ai
          </Link>
          <div className="flex items-center space-x-6">
            <Link
              href="/app"
              className="text-gray-600 hover:text-gray-900 transition-all duration-200 hover:scale-105 font-medium relative group"
            >
              App
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="/status"
              className="text-gray-600 hover:text-gray-900 transition-all duration-200 hover:scale-105 font-medium relative group"
            >
              Status
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
