// app/contact/page.tsx
import { EnvelopeIcon, ClockIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Need help with WallMotion? We re here to assist you with any questions or issues.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* General Support */}
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <EnvelopeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">General Support</h3>
            <p className="text-gray-600 mb-4">Questions about installation, usage, or features</p>
            <a 
              href="mailto:support@wallmotion.app" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              support@wallmotion.app
            </a>
          </div>

          {/* Technical Issues */}
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Issues</h3>
            <p className="text-gray-600 mb-4">Bug reports, crashes, or compatibility problems</p>
            <a 
              href="mailto:bugs@wallmotion.app" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              bugs@wallmotion.app
            </a>
          </div>

          {/* Legal & Privacy */}
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <GlobeAltIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal & Privacy</h3>
            <p className="text-gray-600 mb-4">Privacy concerns, DMCA, or legal inquiries</p>
            <a 
              href="mailto:legal@wallmotion.app" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              legal@wallmotion.app
            </a>
          </div>
        </div>

        {/* Specialized Contact */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Specialized Support</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Refunds & Billing</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Refund requests (30-day guarantee)</li>
                <li>• Billing inquiries</li>
                <li>• License management</li>
                <li>• Payment issues</li>
              </ul>
              <a 
                href="mailto:refunds@wallmotion.app" 
                className="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block"
              >
                refunds@wallmotion.app
              </a>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">DMCA & Copyright</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Copyright infringement claims</li>
                <li>• DMCA takedown notices</li>
                <li>• Counter-notifications</li>
                <li>• Intellectual property issues</li>
              </ul>
              <a 
                href="mailto:dmca@wallmotion.app" 
                className="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block"
              >
                dmca@wallmotion.app
              </a>
            </div>
          </div>
        </div>

        {/* Response Times */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Response Times</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-900">General Support:</span>
              <p className="text-gray-600">Within 24 hours</p>
            </div>
            <div>
              <span className="font-medium text-gray-900">Technical Issues:</span>
              <p className="text-gray-600">Within 12 hours</p>
            </div>
            <div>
              <span className="font-medium text-gray-900">Legal Matters:</span>
              <p className="text-gray-600">Within 72 hours</p>
            </div>
          </div>
        </div>

        {/* Before Contacting */}
        <div className="bg-gray-100 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Before Contacting Us</h3>
          <p className="text-gray-600 mb-4">
            Please check our resources first - you might find your answer immediately:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>• <a href="/faq" className="text-blue-600 hover:text-blue-800">FAQ</a> - Common questions and answers</li>
            <li>• <a href="/help" className="text-blue-600 hover:text-blue-800">Help Center</a> - Detailed guides and tutorials</li>
            <li>• <a href="/system-requirements" className="text-blue-600 hover:text-blue-800">System Requirements</a> - Compatibility information</li>
            <li>• <a href="/troubleshooting" className="text-blue-600 hover:text-blue-800">Troubleshooting</a> - Solutions for common issues</li>
          </ul>
        </div>
      </div>
    </div>
  )
}