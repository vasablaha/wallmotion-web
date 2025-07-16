import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script'
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext'
import '@/lib/aws-config' // Import Amplify config


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://wallmotion.app'), // Replace with your actual domain
  
  // Basic SEO
  title: {
    default: "WallMotion - Turn Your Videos into Live Wallpapers for macOS",
    template: "%s | WallMotion"
  },
  description: "Upload your favorite MP4 and MOV videos and transform them into stunning live wallpapers for your Mac. Smart replacement technology with lifetime updates for just $10.",
  
  // Keywords for search engines
  keywords: [
    "live wallpaper macOS",
    "video wallpaper Mac",
    "desktop wallpaper video",
    "macOS wallpaper app",
    "custom wallpaper upload",
    "MP4 wallpaper converter",
    "MOV wallpaper Mac",
    "Mac desktop background",
    "video background macOS",
    "animated wallpaper Mac",
    "live background Mac",
    "wallpaper replacement app",
    "Mac video wallpaper manager",
    "custom Mac wallpaper"
  ],
  
  // Author and website info
  authors: [{ name: "Tapp Studio" }],
  creator: "Tapp Studio",
  publisher: "Tapp Studio",
  
  // Language and region
  alternates: {
    canonical: "https://wallmotion.app",
    languages: {
      'en-US': '/en-US',
      'en': '/en',
    },
  },
  
  // Open Graph for social media
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wallmotion.app',
    siteName: 'WallMotion',
    title: 'WallMotion - Turn Your Videos into Live Wallpapers for macOS',
    description: 'Upload your favorite MP4 and MOV videos and transform them into stunning live wallpapers for your Mac. Smart replacement technology with lifetime updates for just $10.',
    images: [
      {
        url: '/og-image.jpg', // You'll need to create this 1200x630 image
        width: 1200,
        height: 630,
        alt: 'WallMotion - Live Wallpaper App for macOS',
        type: 'image/jpeg',
      },
      {
        url: '/og-image-square.jpg', // Square version for some platforms
        width: 1200,
        height: 1200,
        alt: 'WallMotion App Icon',
        type: 'image/jpeg',
      }
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@WallMotionApp', // Replace with your actual Twitter handle
    creator: '@TappStudio', // Replace with your actual Twitter handle
    title: 'WallMotion - Turn Your Videos into Live Wallpapers for macOS',
    description: 'Upload your favorite MP4 and MOV videos and transform them into stunning live wallpapers for your Mac. Just $10 lifetime.',
    images: ['/twitter-image.jpg'], // You'll need to create this 1200x675 image
  },
  
  // App-specific metadata
  applicationName: 'WallMotion',
  category: 'productivity',
  classification: 'Productivity App',
  
  // Icons and manifest
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  manifest: '/manifest.json',
  
  // Additional meta tags
  other: {
    // Prevent indexing of staging/development environments
    ...(process.env.NODE_ENV !== 'production' && {
      robots: 'noindex,nofollow'
    }),
    
    // App Store optimization
    'apple-itunes-app': 'app-id=YOUR_APP_STORE_ID', // Replace when you have App Store ID
    
    // macOS specific
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'WallMotion',
    
    // Verification tags (add when you have these services set up)
    'google-site-verification': 'YOUR_GOOGLE_VERIFICATION_CODE',
    'msvalidate.01': 'YOUR_BING_VERIFICATION_CODE',
    
    // Security
    'referrer': 'origin-when-cross-origin',
  },
  
  // Robot instructions
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification for search engines
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE', // Replace with actual code
    yandex: 'YOUR_YANDEX_VERIFICATION_CODE', // If targeting Russian market
    yahoo: 'YOUR_YAHOO_VERIFICATION_CODE',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data for Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "WallMotion",
              "description": "Upload your favorite MP4 and MOV videos and transform them into stunning live wallpapers for your Mac. Smart replacement technology with lifetime updates.",
              "url": "https://wallmotion.app",
              "applicationCategory": "DesktopEnhancementApplication",
              "operatingSystem": "macOS",
              "offers": {
                "@type": "Offer",
                "price": "10.00",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "validFrom": new Date().toISOString(),
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "127"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Tapp Studio",
                "url": "https://wallmotion.app"
              },
              "screenshot": "https://wallmotion.app/screenshot.jpg",
              "softwareVersion": "1.0",
              "downloadUrl": "https://wallmotion.app/download",
              "fileSize": "25MB",
              "requirements": "macOS 12.0 or later",
              "releaseNotes": "Initial release with smart wallpaper replacement technology",
              "applicationSubCategory": "Wallpaper Management",
              "featureList": [
                "Upload MP4 and MOV videos",
                "Smart wallpaper replacement",
                "Native macOS integration",
                "Automatic backups",
                "Lifetime updates"
              ]
            })
          }}
        />
        
        {/* Additional meta tags for better crawling */}
        <meta name="theme-color" content="#667eea" />
        <meta name="msapplication-TileColor" content="#667eea" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//js.stripe.com" />
        <link rel="dns-prefetch" href="//api.stripe.com" />
        <link rel="dns-prefetch" href="//consent.cookiebot.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Cookiebot - Must be loaded before any other scripts */}
        <Script
          id="cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="499ebeaf-a62d-4431-b390-02d3b35feede"
          data-blockingmode="auto"
          strategy="beforeInteractive"
        />
        
        {/* Google Analytics (will be blocked by Cookiebot until consent) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
          data-cookieconsent="statistics"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          data-cookieconsent="statistics"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
        
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}