// app/components/Footer.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 relative">
                <Image
                  src="/logo.png"
                  alt="WallMotion Logo"
                  fill
                  className="object-contain"
                />
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
              <a href="mailto:info@tapp-studio.cz" className="text-sm hover:text-white transition-colors">
                info@tapp-studio.cz
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
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><a href="mailto:info@tapp-studio.cz?subject=Help" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="mailto:info@tapp-studio.cz?subject=Technical Issue" className="hover:text-white transition-colors">Technical Support</a></li>
              <li><a href="mailto:info@tapp-studio.cz?subject=Bug Report" className="hover:text-white transition-colors">Report Bug</a></li>
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
              <a href="mailto:info@tapp-studio.cz" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Important Legal Notice */}
          
        </div>
      </div>
    </footer>
  )
}