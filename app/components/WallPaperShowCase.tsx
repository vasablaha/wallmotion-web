'use client'

import { useRef, useEffect, useState, SyntheticEvent } from 'react'

interface VideoItem {
  id: number
  src: string
  title: string
}

interface WallpaperShowcaseProps {
  onPurchase?: () => void | Promise<void>
}

// Generujeme 20 video placeholders s reálnými názvy souborů
const videos: VideoItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  src: `/videos/video${i + 1}.mp4`, // Skutečné cesty k video souborům
  title: `Amazing Wallpaper ${i + 1}`
}))

function VideoCard({ video }: { video: VideoItem }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Automatické přehrávání hned po načtení
  useEffect(() => {
    if (videoRef.current && isLoaded && !hasError) {
      videoRef.current.play().catch((error) => {
        console.log(`Video ${video.id} play failed:`, error)
      })
    }
  }, [isLoaded, hasError, video.id])

  const handleVideoError = (error: SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error(`Video ${video.id} error:`, error)
    setHasError(true)
  }

  const handleVideoLoad = () => {
    console.log(`Video ${video.id} loaded successfully:`, video.src)
    setIsLoaded(true)
  }

  const handleCanPlay = () => {
    console.log(`Video ${video.id} can play:`, video.src)
    setIsLoaded(true)
  }

  return (
    <div className="flex-shrink-0 w-44 h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl relative">
      {!hasError ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          autoPlay
          preload="metadata"
          onError={handleVideoError}
          onLoadedData={handleVideoLoad}
          onCanPlay={handleCanPlay}
          onLoadStart={() => console.log(`Video ${video.id} starting to load:`, video.src)}
          style={{ pointerEvents: 'none' }} // Zabraňuje interakci s videem
        >
          <source src={video.src} type="video/mp4" />
          <source src={`https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`} type="video/mp4" />
        </video>
      ) : (
        // Fallback placeholder když video nenačte
        <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex flex-col items-center justify-center p-4">
          <div className="text-center text-white">
            <div className="text-4xl mb-2">❌</div>
            <div className="text-sm font-medium">Video {video.id}</div>
            <div className="text-xs opacity-75 mt-1">Failed to load</div>
          </div>
        </div>
      )}
      
      {/* Loading overlay - pouze spinner bez textu */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  )
}

export default function WallpaperShowcase({ onPurchase }: WallpaperShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Scroll to current video
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current
      const cardWidth = 176 + 24 // 44 * 4 + gap
      const scrollLeft = currentIndex * cardWidth
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      })
    }
  }, [currentIndex])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length)
  }

  const handlePurchaseClick = async () => {
    console.log('Purchase button clicked!')
    if (onPurchase) {
      await onPurchase()
    } else {
      // Fallback akce pokud není onPurchase předán
      alert('Purchase functionality needs to be connected!')
    }
  }

  const getPurchaseButtonText = () => {
    return 'Get WallMotion for $15'
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full px-6 py-3 mb-6">
            <span className="text-2xl">✨</span>
            <span className="text-sm font-semibold text-green-800">Více jak 100+ uživatelů</span>
            <span className="text-sm text-green-600">už vytváří úžasné tapety</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ukázky Live Wallpapers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Prohlédněte si kreativní tapety vytvořené našimi uživateli
          </p>
        </div>

        {/* Video Slider */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
          >
            <span className="text-gray-700 text-xl">‹</span>
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
          >
            <span className="text-gray-700 text-xl">›</span>
          </button>

          {/* Video Container */}
          <div 
            ref={containerRef}
            className="flex space-x-6 overflow-x-hidden scroll-smooth px-12"
          >
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
              />
            ))}
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {videos.slice(0, 10).map((_, index) => ( // Zobrazíme jen prvních 10 dots
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex % 10
                    ? 'bg-blue-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
            {videos.length > 10 && (
              <div className="text-gray-400 text-xs">...</div>
            )}
          </div>
        </div>

        {/* Purchase Button Section */}
        <div className="text-center mt-16">
          <div className="max-w-md mx-auto">
            
            
            <button
              onClick={handlePurchaseClick}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {getPurchaseButtonText()}
            </button>
            
            <p className="text-sm text-gray-500 mt-4">
              ✅ Lifetime licence • ✅ 30-day money-back guarantee • ✅ Secure payment via Stripe
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}