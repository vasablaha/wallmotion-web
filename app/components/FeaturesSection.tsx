import React from 'react'
import {
  ComputerDesktopIcon,
  CloudArrowUpIcon,
  SwatchIcon,
  CubeTransparentIcon,
  GlobeAltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

type Feature = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  description: string
}

const features: Feature[] = [
  { icon: ComputerDesktopIcon, title: 'Smart Wallpaper Replacement', description: 'Automatically detects and replaces your current live wallpaper with one-click simplicity' },
  { icon: CloudArrowUpIcon, title: 'Upload Popular Formats', description: 'Supports MP4, MOV, and other common video formats. Drag & drop to transform your videos into wallpapers' },
  { icon: SwatchIcon, title: 'Perfect Quality Conversion', description: 'Optimizes your videos for perfect wallpaper quality while maintaining smooth performance' },
  { icon: CubeTransparentIcon, title: 'Beautiful Interface', description: 'Clean, intuitive design that makes customizing your desktop a joy' },
  { icon: GlobeAltIcon, title: 'Native macOS App', description: 'Built specifically for macOS with full system integration and sandboxed security' },
  { icon: ShieldCheckIcon, title: 'Safe & Reliable', description: 'Automatic backups and safe file handling protect your system and current wallpapers' }
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create the perfect desktop experience
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="group p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}