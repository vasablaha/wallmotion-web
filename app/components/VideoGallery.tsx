import React from 'react'
import { CheckIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'

const showcaseItems = [
  'Your vacation videos',
  'Personal recordings',
  'Downloaded content',
  'Creative projects',
  'Screen recordings',
  'MP4 & MOV files'
]

export default function VideoGallery() {
  return (
    <section id="gallery" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Upload Any Video Type
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From vacation memories to abstract art — any video becomes a stunning wallpaper
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {showcaseItems.map((item, idx) => (
            <div
              key={idx}
              className="group relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <CloudArrowUpIcon className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute bottom-4 left-4 text-white font-medium">{item}</div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">Supports popular formats: MP4, MOV, and more</p>
          <div className="inline-flex items-center space-x-2 bg-green-100 rounded-full px-6 py-3">
            <CheckIcon className="w-5 h-5 text-green-600" />
           
          </div>
        </div>
      </div>
    </section>
  )
}