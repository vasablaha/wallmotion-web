// app/components/HeroSection.tsx - Upravený s Three.js knihou

import React, { Suspense } from 'react'
import { ChevronRightIcon, PlayIcon } from '@heroicons/react/24/solid'
import { useAuth } from '@/contexts/AuthContext'
import dynamic from 'next/dynamic'

// Dynamicky načteme MacBookDemo komponentu (aby se Three.js načetlo pouze na klientovi)
const MacBookDemo = dynamic(() => import('./MacBookDemo'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-white/80 font-medium">Loading MacBook demo...</p>
      </div>
    </div>
  )
})

type HeroSectionProps = {
  onPurchase: () => Promise<void>
}

export default function HeroSection({ onPurchase }: HeroSectionProps) {
  const { user, loading: authLoading } = useAuth()
  
  const getButtonText = () => {
    if (authLoading) return 'Loading...'
    if (user) return 'Go to My Profile'
    return 'Get WallMotion - $15'
  }
  
  const getButtonIcon = () => {
    if (authLoading) return null
    return <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
  }

  return (
    <section className="pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
      
      {/* Floating particles background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400/30 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400/30 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-pink-400/30 rounded-full animate-float-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-8">
            <span className="text-sm font-semibold text-blue-800">✨ Upload Any Video</span>
            <span className="text-sm text-blue-600">as Live Wallpaper</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">Transform Your</span><br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Desktop Forever
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Upload your favorite videos (MP4, MOV) and turn them into stunning live wallpapers. 
            Smart replacement technology makes it effortless.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={onPurchase}
              disabled={authLoading}
              className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              <span>{getButtonText()}</span>
              {getButtonIcon()}
            </button>
            
            <button className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors font-semibold">
              <PlayIcon className="w-6 h-6" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>

        {/* MacBook Lock Screen Demo */}
        <div className="relative max-w-6xl mx-auto">
          <Suspense fallback={
            <div className="w-full h-[600px] bg-black flex items-center justify-center rounded-3xl shadow-2xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white/80 font-medium">Loading demo...</p>
              </div>
            </div>
          }>
            <MacBookDemo />
          </Suspense>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite 2s;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite 1s;
        }
      `}</style>
    </section>
  )
}