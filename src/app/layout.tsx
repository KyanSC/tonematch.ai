import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from '@/components/navbar'
import { ToastProvider } from '@/components/ui/toast'
import { LoadingScreen } from '@/components/ui/loading'
import { ErrorBoundary } from '@/components/error-boundary'

const inter = Inter({ subsets: ['latin'] })

const title = 'ToneAdapt — Match Any Guitar Tone to Your Gear'
const description = 'AI-powered guitar tone adaptation. Research the original tone for any song and auto-adapt amp, EQ, and pedal settings to your exact guitar and rig.'
const url = 'https://toneadapt.com'

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  keywords: [
    'guitar tone',
    'tone matching',
    'tone adaptation',
    'amp settings',
    'pedal settings',
    'AI guitar',
    'ToneAdapt',
    'guitar tone research',
    'tone matching app',
    'guitar amp settings',
    'tone adaptation tool',
    'guitar tone analyzer',
    'AI tone matching',
    'guitar rig settings',
    'tone matching software'
  ],
  alternates: { 
    canonical: url 
  },
  openGraph: {
    type: 'website',
    url,
    title,
    description,
    siteName: 'ToneAdapt',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'ToneAdapt - AI-Powered Guitar Tone Matching',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@toneadapt',
    title,
    description,
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'C30XoB37Ha7xdE6Yup1MNvwuSmpZ_3lkGxoOVqt5qz4',
  },
  other: {
    'next-head-count': '0',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ToneAdapt',
    url: url,
    description: 'AI-powered guitar tone adaptation matching legendary tones to your exact gear.',
    applicationCategory: 'MusicApplication',
    operatingSystem: 'Web',
    offers: { 
      '@type': 'Offer', 
      price: '0', 
      priceCurrency: 'USD' 
    },
    author: {
      '@type': 'Organization',
      name: 'ToneAdapt',
      url: url
    },
    featureList: [
      'AI-powered tone research',
      'Gear-specific tone adaptation',
      'Real-time web search integration',
      'Comprehensive amp settings',
      'Guitar knob recommendations',
      'Confidence scoring'
    ],
    screenshot: `${url}/opengraph-image.png`,
    softwareVersion: '1.0.0',
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0]
  }

  return (
    <html lang="en">
      <head>
        {/* Preload critical CSS */}
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS fallback to prevent FOUC */
            body { 
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
              margin: 0;
              padding: 0;
            }
            .loading { opacity: 0; }
            .loaded { opacity: 1; transition: opacity 0.3s ease-in; }
            /* Hide content until CSS loads */
            .css-loading { visibility: hidden; }
            .css-loaded { visibility: visible; }
          `
        }} />
      </head>
      <body className={`${inter.className} css-loading`}>
        <ErrorBoundary>
          <LoadingScreen />
          <div id="app-content" className="css-loading">
            <ToastProvider>
              <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="relative z-10">
                  <Navbar />
                  <main>{children}</main>
                </div>
              </div>
            </ToastProvider>
          </div>
          {/* Ensure CSS is loaded before showing content */}
          <script dangerouslySetInnerHTML={{
            __html: `
              // Check if CSS is loaded
              function checkCSSLoaded() {
                const styles = document.styleSheets;
                let cssLoaded = false;
                
                for (let i = 0; i < styles.length; i++) {
                  try {
                    if (styles[i].cssRules && styles[i].cssRules.length > 0) {
                      cssLoaded = true;
                      break;
                    }
                  } catch (e) {
                    // CORS error, but CSS is likely loaded
                    cssLoaded = true;
                    break;
                  }
                }
                
                if (cssLoaded) {
                  document.body.classList.add('css-loaded');
                  document.getElementById('app-content').classList.add('css-loaded');
                  document.querySelector('.fixed').style.display = 'none';
                } else {
                  setTimeout(checkCSSLoaded, 100);
                }
              }
              
              // Start checking when DOM is ready
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', checkCSSLoaded);
              } else {
                checkCSSLoaded();
              }
              
              // Fallback: show content after 2 seconds max
              setTimeout(() => {
                document.body.classList.add('css-loaded');
                document.getElementById('app-content').classList.add('css-loaded');
                const loadingScreen = document.querySelector('.fixed');
                if (loadingScreen) loadingScreen.style.display = 'none';
              }, 2000);
            `
          }} />
          <Analytics />
        </ErrorBoundary>
      </body>
    </html>
  )
}
