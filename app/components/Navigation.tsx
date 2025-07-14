import React from 'react'
import { ComputerDesktopIcon } from '@heroicons/react/24/outline'

type NavigationProps = {
  isScrolled: boolean
  onPurchase: () => Promise<void>
}

export default function Navigation({ isScrolled, onPurchase }: NavigationProps) {
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <ComputerDesktopIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              WallMotion
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Features
            </a>
            <a href="#gallery" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Gallery
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Pricing
            </a>
            <button
              onClick={onPurchase}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Buy Now - $10
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}