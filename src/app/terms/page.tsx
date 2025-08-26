import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-600 text-lg">
          Terms and conditions for using ToneMatch.ai
        </p>
      </div>

      <div className="space-y-6">
        <Card className="shadow-glow">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              By using ToneMatch.ai, you agree to these terms of service. If you don&apos;t agree, please don&apos;t use our service.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-glow">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Service Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              ToneMatch.ai is an AI-powered service that researches guitar tones and adapts them to your gear. 
              We use web search and AI analysis to provide tone recommendations.
            </p>
            <p className="text-gray-600">
              <strong>Disclaimer:</strong> Tone settings are recommendations based on research and AI analysis. 
              Results may vary and should be used as a starting point for your own experimentation.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-glow">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">You agree to:</h3>
              <ul className="text-gray-600 space-y-2 list-disc list-inside">
                <li>Use the service for legitimate guitar tone research</li>
                <li>Not attempt to overload or abuse our systems</li>
                <li>Not use the service for any illegal purposes</li>
                <li>Respect our rate limits and fair use policies</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-glow">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Our Rights</h3>
              <p className="text-gray-600">
                ToneMatch.ai and its content are protected by copyright and other intellectual property laws.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Your Rights</h3>
              <p className="text-gray-600">
                You retain rights to any content you submit. We may cache and use your queries to improve our service.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-glow">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              ToneMatch.ai is provided &quot;as is&quot; without warranties. We&apos;re not liable for any damages arising from 
              use of our service or tone recommendations.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-glow">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Questions about these terms? Please contact us through our website.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
