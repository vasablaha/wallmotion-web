'use client'

import { useState } from 'react'

export default function MacBookDemo() {
  const [password, setPassword] = useState('')

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Nic neděláme - zůstává zamčené
  }

  return (
    <div className="w-full max-w-none h-[600px] relative bg-black overflow-hidden rounded-3xl shadow-2xl mx-auto">
      {/* CSS Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 macbook-gradient">
        <div className="absolute inset-0 opacity-30">
          <div className="macbook-orb macbook-orb-1"></div>
          <div className="macbook-orb macbook-orb-2"></div>
          <div className="macbook-orb macbook-orb-3"></div>
          <div className="macbook-orb macbook-orb-4"></div>
        </div>
        
        {/* Floating Feature Icons */}
        <div className="absolute inset-0 opacity-25">
          {/* YouTube Icon */}
          <div className="floating-icon youtube-icon" title="Import from YouTube">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">▶</span>
            </div>
          </div>
          
          {/* Upload Icon */}
          <div className="floating-icon upload-icon" title="Upload from Computer">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">⬆</span>
            </div>
          </div>
          
          {/* MOV Format */}
          <div className="floating-icon mov-icon" title="MOV Format Support">
            <div className="px-2 py-1 bg-purple-600 rounded shadow-lg">
              <span className="text-white font-bold text-xs">.MOV</span>
            </div>
          </div>
          
          {/* MP4 Format */}
          <div className="floating-icon mp4-icon" title="MP4 Format Support">
            <div className="px-2 py-1 bg-blue-600 rounded shadow-lg">
              <span className="text-white font-bold text-xs">.MP4</span>
            </div>
          </div>
          
          {/* Desktop Icon */}
          <div className="floating-icon desktop-icon" title="Desktop Wallpaper">
            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-sm">🖥</span>
            </div>
          </div>
          
          {/* Wallpaper Icon */}
          <div className="floating-icon wallpaper-icon" title="Live Wallpaper">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-sm">🎨</span>
            </div>
          </div>
          
          {/* AVI Format */}
          <div className="floating-icon avi-icon" title="AVI Format Support">
            <div className="px-2 py-1 bg-orange-600 rounded shadow-lg">
              <span className="text-white font-bold text-xs">.AVI</span>
            </div>
          </div>
          
          {/* WebM Format */}
          <div className="floating-icon webm-icon" title="WebM Format Support">
            <div className="px-2 py-1 bg-pink-600 rounded shadow-lg">
              <span className="text-white font-bold text-xs">.WEBM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>

      {/* macOS Menu Bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-8 py-3 text-white text-base font-medium bg-black/10 backdrop-blur-sm">
        <div className="flex items-center space-x-6">
          <span className="text-xl">🍎</span>
        </div>
        <div className="flex items-center space-x-6">
          <span>Sat 14:30</span>
          <span>🔋</span>
          <span>📶</span>
        </div>
      </div>

      {/* Lock Screen */}
      <div className="absolute inset-0 flex flex-col">
        {/* Clock - nahoře */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-7xl font-light mb-3">14:30</div>
            <div className="text-2xl opacity-80">Saturday, January 25</div>
          </div>
        </div>

        {/* User Login Area - dole */}
        <div className="flex flex-col items-center space-y-4 pb-20">
          {/* User Avatar */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-white font-bold text-xl">W</span>
          </div>

          {/* Username */}
          <div className="text-white text-lg font-medium">WallMotion</div>

          {/* Password Input */}
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter password"
              className="w-72 px-5 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white placeholder-white/60 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </form>
        </div>
      </div>

      {/* Global CSS pro animace */}
      <style jsx global>{`
        @keyframes macbook-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .macbook-gradient {
          background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #6366f1, #a855f7);
          background-size: 400% 400%;
          animation: macbook-gradient 4s ease infinite;
        }
        
        .macbook-orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: macbook-float 3s ease-in-out infinite;
        }
        
        .macbook-orb-1 {
          width: 200px;
          height: 200px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .macbook-orb-2 {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 15%;
          animation-delay: 1s;
        }
        
        .macbook-orb-3 {
          width: 100px;
          height: 100px;
          bottom: 30%;
          left: 60%;
          animation-delay: 2s;
        }
        
        .macbook-orb-4 {
          width: 250px;
          height: 250px;
          top: 10%;
          right: 20%;
          animation-delay: 0.5s;
        }
        
        @keyframes macbook-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }
        
        /* Floating Icons */
        .floating-icon {
          position: absolute;
          animation: icon-float 4s ease-in-out infinite;
        }
        
        .youtube-icon {
          top: 15%;
          left: 20%;
          animation-delay: 0s;
        }
        
        .upload-icon {
          top: 25%;
          right: 25%;
          animation-delay: 1s;
        }
        
        .mov-icon {
          top: 45%;
          left: 15%;
          animation-delay: 2s;
        }
        
        .mp4-icon {
          top: 55%;
          right: 20%;
          animation-delay: 3s;
        }
        
        .desktop-icon {
          bottom: 25%;
          left: 25%;
          animation-delay: 1.5s;
        }
        
        .wallpaper-icon {
          bottom: 30%;
          right: 30%;
          animation-delay: 2.5s;
        }
        
        .avi-icon {
          top: 70%;
          left: 70%;
          animation-delay: 0.8s;
        }
        
        .webm-icon {
          bottom: 15%;
          right: 15%;
          animation-delay: 1.8s;
        }
        
        @keyframes icon-float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.6;
          }
          25% { 
            transform: translateY(-20px) translateX(10px) rotate(2deg);
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-10px) translateX(-5px) rotate(-1deg);
            opacity: 1;
          }
          75% { 
            transform: translateY(-25px) translateX(15px) rotate(3deg);
            opacity: 0.7;
          }
        }
        
        /* Hover effects for icons */
        .floating-icon:hover {
          animation-play-state: paused;
          transform: scale(1.2) !important;
          opacity: 1 !important;
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  )
}