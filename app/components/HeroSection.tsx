// app/components/HeroSection.tsx - Upravený s auth aware button

import React from 'react'
import { ChevronRightIcon, PlayIcon } from '@heroicons/react/24/solid'
import { useAuth } from '@/contexts/AuthContext'

type HeroSectionProps = {
  onPurchase: () => Promise<void>
}

export default function HeroSection({ onPurchase }: HeroSectionProps) {
  const { user, loading: authLoading } = useAuth()
  
  const getButtonText = () => {
    if (authLoading) return 'Loading...'
    if (user) return 'Go to My Profile'
    return 'Get WallMotion - $10'
  }
  
  const getButtonIcon = () => {
    if (authLoading) return null
    return <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
  }

  return (
    <section className="pt-24 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
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
            Upload your favorite videos (MP4, MOV) and turn them into stunning live wallpapers. Smart replacement technology makes it effortless.
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
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl p-8 backdrop-blur-sm border border-white/20">
            <div className="bg-gray-900 rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30" />
              <PlayIcon className="w-20 h-20 text-white/80 z-10" />
              <div className="absolute bottom-4 left-4 text-white/80 text-sm font-medium">
                Preview: WallMotion in Action
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}