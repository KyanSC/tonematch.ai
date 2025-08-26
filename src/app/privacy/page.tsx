import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600 text-lg">
          How we handle your data at ToneMatch.ai
        </p>
      </div>

      <div className="space-y-6">
        <Card className="shadow-glow">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Data We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Tone Research Cache</h3>
              <p className="text-gray-600">
                We store cached results of tone research queries to improve performance and reduce API costs. 
                This includes song names, artist names, and the researched tone settings.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Usage Analytics</h3>
              <p className="text-gray-600">
                Basic usage analytics to understand how our service is used and improve functionality.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-glow">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Data Processors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">OpenAI</h3>
              <p className="text-gray-600">
                We use OpenAI&apos;s API to research guitar tones and adapt settings. Your queries are sent to OpenAI 
                for processing according to their privacy policy.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Supabase</h3>
              <p className="text-gray-600">
                We use Supabase (PostgreSQL) to store cached research results and improve service performance.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-glow">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Data Deletion</h3>
              <p className="text-gray-600">
                To request deletion of your cached data, please contact us through our website.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">No Personal Information</h3>
              <p className="text-gray-600">
                We do not collect or store personal information like names, emails, or IP addresses.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-glow">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This privacy policy may be updated. We&apos;ll notify users of significant changes through our website.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
