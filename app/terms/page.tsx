// app/terms/page.tsx
"use client"
import Navbar from '../components/NavBar'
import Footer from '@/app/components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isScrolled={true} onPurchase={async () => {}} />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
            <p className="text-gray-600 mb-8">Last Updated: January 2025</p>

            <div className="prose text-black prose-lg max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By downloading, installing, or using WallMotion (&quot;the Software&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). 
                If you do not agree to these Terms, do not use the Software.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                WallMotion is a macOS application that allows users to create live wallpapers from video content. The Software includes features for:
              </p>
              <ul>
                <li>Converting video files to live wallpapers</li>
                <li>Importing videos from various sources including YouTube</li>
                <li>Customizing video segments for wallpaper use</li>
              </ul>

              <h2>3. User Responsibilities and Content Ownership</h2>
              
              <h3>3.1 Content Responsibility</h3>
              <p>
                <strong>YOU ARE SOLELY RESPONSIBLE</strong> for all video content you process using WallMotion. This includes:
              </p>
              <ul>
                <li>Ensuring you have the legal right to use any video content</li>
                <li>Obtaining necessary permissions for copyrighted material</li>
                <li>Complying with applicable copyright laws and regulations</li>
                <li>Respecting content creators&apos; intellectual property rights</li>
              </ul>

              <h3>3.2 YouTube Content</h3>
              <p>When using WallMotion&apos;s YouTube import feature:</p>
              <ul>
                <li>You must comply with YouTube&apos;s Terms of Service</li>
                <li>You may only download content you own or have explicit permission to use</li>
                <li>You acknowledge that downloading copyrighted content without permission may violate copyright laws</li>
                <li>WallMotion does not endorse or encourage copyright infringement</li>
              </ul>

              <h3>3.3 Prohibited Uses</h3>
              <p>You may NOT use WallMotion to:</p>
              <ul>
                <li>Download or distribute copyrighted content without permission</li>
                <li>Violate any third-party rights or platform terms of service</li>
                <li>Engage in any illegal activities</li>
                <li>Circumvent digital rights management (DRM) systems</li>
              </ul>

              <h2>4. Intellectual Property</h2>
              
              <h3>4.1 WallMotion Software</h3>
              <p>
                WallMotion and all related intellectual property rights are owned by Tapp Studio. You are granted a limited, 
                non-exclusive license to use the Software for personal, non-commercial purposes.
              </p>

              <h3>4.2 User Content</h3>
              <p>
                WallMotion does not claim ownership of any video content you process. You retain all rights to your content, 
                and you are responsible for protecting those rights.
              </p>

              <h2>5. Disclaimers and Limitations</h2>
              
              <h3>5.1 No Warranty</h3>
              <p>
                THE SOFTWARE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, 
                INCLUDING WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
              </p>

              <h3>5.2 Limitation of Liability</h3>
              <p>
                IN NO EVENT SHALL TAPP STUDIO BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES 
                ARISING OUT OF OR IN CONNECTION WITH THE USE OF WALLMOTION.
              </p>

              <h3>5.3 Copyright Infringement</h3>
              <p>
                TAPP STUDIO IS NOT RESPONSIBLE FOR ANY COPYRIGHT INFRINGEMENT COMMITTED BY USERS. Users agree to indemnify 
                and hold harmless Tapp Studio from any claims arising from their use of the Software.
              </p>

              <h2>6. DMCA Compliance</h2>
              <p>
                WallMotion respects intellectual property rights. If you believe your copyrighted work has been infringed 
                through the use of our Software, please contact us at info@tapp-studio.cz with:
              </p>
              <ul>
                <li>Description of the copyrighted work</li>
                <li>Evidence of your ownership</li>
                <li>Details of the alleged infringement</li>
                <li>Your contact information</li>
              </ul>

              <h2>7. Termination</h2>
              <p>
                These Terms are effective until terminated. We may terminate your license at any time if you violate these Terms. 
                Upon termination, you must cease all use of the Software and destroy all copies.
              </p>

              <h2>8. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the Czech Republic, 
                without regard to its conflict of law provisions.
              </p>

              <h2>9. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Continued use of the Software after changes 
                constitutes acceptance of the new Terms.
              </p>

              <h2>10. Contact Information</h2>
              <p>For questions about these Terms, contact us at:</p>
              <ul>
                <li>Email: info@tapp-studio.cz</li>
                <li>Address: Tapp Studio, Czech Republic</li>
              </ul>

              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mt-8">
                <p className="font-semibold text-amber-800">
                  By using WallMotion, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}