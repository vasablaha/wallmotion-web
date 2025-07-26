// app/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Navbar from './components/NavBar'
import Footer from './components/Footer'
import HeroSection from './components/HeroSection'
import WallpaperShowcase from './components/WallPaperShowCase'
import FeaturesSection from './components/FeaturesSection'
import VideoGallery from './components/VideoGallery'
import ProfileModal from './components/ProfileModal'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
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
    
    if (authLoading) {
      console.log('⏳ Auth still loading, waiting...')
      return
    }
    
    if (!user) {
      console.log('🚫 User not logged in, redirecting to login')
      router.push('/login?message=Please sign in to purchase a license')
      return
    }
    
    console.log('✅ User logged in, redirecting to profile')
    router.push('/profile')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar isScrolled={isScrolled} onPurchase={handlePurchase} />
      <HeroSection onPurchase={handlePurchase} />
      <WallpaperShowcase />
      <FeaturesSection />
      <VideoGallery />

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, One-Time Payment
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get lifetime access to WallMotion for just $15. No subscriptions, no hidden fees.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-purple-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                <CheckIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Lifetime License</h3>
              <div className="text-4xl font-bold text-purple-600 mb-2">$15</div>
              <p className="text-gray-600">One-time payment, lifetime access</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Unlimited wallpaper creation</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">YouTube video import</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">All video formats supported</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Free lifetime updates</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">30-day money-back guarantee</span>
              </li>
            </ul>

            <button
              onClick={handlePurchase}
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {authLoading ? (
                'Loading...'
              ) : user ? (
                'Go to My Profile'
              ) : (
                'Get WallMotion for $15'
              )}
            </button>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Secure payment via Stripe • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <ProfileModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}