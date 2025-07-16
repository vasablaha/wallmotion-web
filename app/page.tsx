// app/page.tsx - Upravený s authentication check

'use client'

import React, { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import VideoGallery from './components/VideoGallery'
import ProfileModal from './components/ProfileModal'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

import { ComputerDesktopIcon, } from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/24/solid'


export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handlePurchase = async () => {
    console.log('🛒 Purchase button clicked')
    console.log('🔐 Auth status:', { user: !!user, authLoading, username: user?.username })
    
    // Čekáme na načtení auth stavu
    if (authLoading) {
      console.log('⏳ Auth still loading, waiting...')
      return
    }
    
    // Pokud uživatel není přihlášený, přesměruj na login
    if (!user) {
      console.log('🚫 User not logged in, redirecting to login')
      router.push('/login?message=Please sign in to purchase a license')
      return
    }
    
    // Pokud je přihlášený, přesměruj na profile (kde může koupit licenci)
    console.log('✅ User logged in, redirecting to profile')
    router.push('/profile')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navigation isScrolled={isScrolled} onPurchase={handlePurchase} />
      <HeroSection onPurchase={handlePurchase} />
      <FeaturesSection />
      <VideoGallery />

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Simple Pricing
            </h2>
            <p className="text-xl text-gray-600">One purchase, lifetime access</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12 text-center hover:shadow-2xl transition-all duration-300">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-2 mb-6">
              <span className="text-sm font-semibold text-blue-800">🎉 Limited Time</span>
            </div>
            <div className="mb-6">
              <span className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">$10</span>
              <span className="text-gray-600 ml-2">lifetime</span>
            </div>
            <div className="space-y-4 mb-8">
              {[
                'Upload unlimited videos',
                'Smart wallpaper replacement',
                'Popular video formats (MP4, MOV)',
                'Native macOS integration',
                'Automatic backups',
                'Lifetime updates'
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center justify-center space-x-3">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handlePurchase}
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? (
                'Loading...'
              ) : user ? (
                'Go to My Profile'
              ) : (
                'Get WallMotion for $10'
              )}
            </button>
            <p className="text-sm text-gray-500 mt-4">
              30-day money-back guarantee • Secure payment via Stripe
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <ComputerDesktopIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">WallMotion</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Turn any video into a stunning live wallpaper for macOS. Simple drag & drop interface with smart replacement technology.
              </p>
              <div className="text-sm text-gray-500">© 2025 Tapp Studio. All rights reserved.</div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#gallery" className="hover:text-white">Gallery</a></li>
                <li><a href="/download" className="hover:text-white">Download</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
                <li><a href="/refund" className="hover:text-white">Refund Policy</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>Made with ❤️ for Mac users worldwide</p>
          </div>
        </div>
      </footer>

      <ProfileModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}