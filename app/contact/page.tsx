// app/contact/page.tsx
"use client"
import { EnvelopeIcon, ClockIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import Navbar from '../components/NavBar'
import Footer from '@/app/components/Footer'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isScrolled={true} onPurchase={async () => {}} />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Need help with WallMotion? We&apos;re here to assist you with any questions or issues.
            </p>
          </div>

          {/* Main Contact */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <EnvelopeIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-gray-600 mb-6">
                For all inquiries, support requests, legal matters, and general questions
              </p>
              <a 
                href="mailto:info@tapp-studio.cz" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <EnvelopeIcon className="w-5 h-5 mr-2" />
                info@tapp-studio.cz
              </a>
            </div>
          </div>

          {/* Contact Categories */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* General Support */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <EnvelopeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">General Support</h3>
              <ul className="text-gray-600 text-sm space-y-1 mb-4">
                <li>• Installation help</li>
                <li>• Usage questions</li>
                <li>• Feature guidance</li>
                <li>• Account issues</li>
              </ul>
              <a 
                href="mailto:info@tapp-studio.cz?subject=General Support" 
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                
              </a>
            </div>

            {/* Technical Issues */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <ClockIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Issues</h3>
              <ul className="text-gray-600 text-sm space-y-1 mb-4">
                <li>• Bug reports</li>
                <li>• App crashes</li>
                <li>• Compatibility problems</li>
                <li>• Performance issues</li>
              </ul>
              <a 
                href="mailto:info@tapp-studio.cz?subject=Technical Issue" 
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                
              </a>
            </div>

            {/* Legal & Privacy */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <GlobeAltIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal & Privacy</h3>
              <ul className="text-gray-600 text-sm space-y-1 mb-4">
                <li>• DMCA notices</li>
                <li>• Privacy concerns</li>
                <li>• Legal inquiries</li>
                <li>• Copyright issues</li>
              </ul>
              <a 
                href="mailto:info@tapp-studio.cz?subject=Legal Inquiry" 
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                
              </a>
            </div>
          </div>

          {/* Billing & Refunds */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing & Refunds</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Refund Requests</h3>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li>• 30-day money-back guarantee</li>
                  <li>• Billing inquiries</li>
                  <li>• License management</li>
                  <li>• Payment issues</li>
                </ul>
                <a 
                  href="mailto:info@tapp-studio.cz?subject=Refund Request" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Request Refund →
                </a>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What to Include</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Purchase date and amount</li>
                  <li>• Email used for purchase</li>
                  <li>• Stripe transaction ID (if available)</li>
                  <li>• Brief reason for refund</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Response Times */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
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

          
        </div>
      </div>
      
      <Footer />
    </div>
  )
}