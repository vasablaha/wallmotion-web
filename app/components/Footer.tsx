// app/components/Footer.tsx
'use client'

import Link from 'next/link'
import { ComputerDesktopIcon, EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ComputerDesktopIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">WallMotion</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Turn any video into a stunning live wallpaper for macOS. Simple drag & drop interface with smart replacement technology.
            </p>
            <div className="flex items-center space-x-2 text-gray-400 mb-4">
              <GlobeAltIcon className="w-4 h-4" />
              <span className="text-sm">Worldwide Support</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <EnvelopeIcon className="w-4 h-4" />
              <a href="mailto:support@wallmotion.app" className="text-sm hover:text-white transition-colors">
                support@wallmotion.app
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#gallery" className="hover:text-white transition-colors">Gallery</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><Link href="/download" className="hover:text-white transition-colors">Download</Link></li>
              <li><Link href="/system-requirements" className="hover:text-white transition-colors">System Requirements</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link href="/dmca" className="hover:text-white transition-colors">DMCA Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link href="/gdpr" className="hover:text-white transition-colors">GDPR Compliance</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/tutorials" className="hover:text-white transition-colors">Tutorials</Link></li>
              <li><Link href="/bug-report" className="hover:text-white transition-colors">Report Bug</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-sm">
              © 2025 Tapp Studio. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-gray-500 text-sm">
              <span>Made with ❤️ for Mac users worldwide</span>
              <Link href="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>
          </div>

          {/* Important Legal Notice */}
          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-400 space-y-2">
              <p className="font-semibold text-gray-300">⚠️ Important Legal Notice:</p>
              <p>
                WallMotion is a tool for creating wallpapers from video content. Users are solely responsible for ensuring they have the right to use any video content they process. This includes obtaining necessary permissions for copyrighted material. WallMotion does not claim ownership of user-generated content and is not responsible for copyright infringement by users.
              </p>
              <p>
                When using YouTube import feature, you must comply with YouTube s Terms of Service and respect content creators rights. Download only content you own or have explicit permission to use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}