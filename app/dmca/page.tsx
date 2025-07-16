// app/dmca/page.tsx
"use client"
import Navbar from '../components/NavBar'
import Footer from '@/app/components/Footer'

export default function DMCAPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isScrolled={true} onPurchase={async () => {}} />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">DMCA Policy</h1>
            <p className="text-gray-600 mb-8">Last Updated: January 2025</p>

            <div className="prose text-black prose-lg max-w-none">
              <h2>Digital Millennium Copyright Act (DMCA) Compliance</h2>
              <p>
                Tapp Studio respects the intellectual property rights of others and expects users of WallMotion to do the same. 
                This DMCA Policy explains how we respond to claims of copyright infringement.
              </p>

              <h2>1. Our Position on Copyright</h2>
              
              <h3>1.1 WallMotion&apos;s Role</h3>
              <p>WallMotion is a tool that allows users to create live wallpapers from video content. <strong>We do not:</strong></p>
              <ul>
                <li>Host or store copyrighted content</li>
                <li>Distribute copyrighted material</li>
                <li>Encourage copyright infringement</li>
                <li>Claim ownership of user-processed content</li>
              </ul>

              <h3>1.2 User Responsibility</h3>
              <p><strong>Users are solely responsible</strong> for ensuring they have the legal right to use any content they process with WallMotion. This includes:</p>
              <ul>
                <li>Obtaining proper permissions for copyrighted material</li>
                <li>Complying with applicable copyright laws</li>
                <li>Respecting content creators&apos; rights</li>
              </ul>

              <h2>2. Copyright Infringement Claims</h2>
              
              <h3>2.1 Filing a DMCA Notice</h3>
              <p>If you believe your copyrighted work has been infringed through the use of WallMotion, please send a written notice to our designated agent with the following information:</p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Required Information:</h4>
                <ol>
                  <li><strong>Identification of the copyrighted work</strong> you claim has been infringed</li>
                  <li><strong>Identification of the allegedly infringing material</strong> and its location</li>
                  <li><strong>Your contact information</strong> including name, address, telephone number, and email</li>
                  <li><strong>A statement</strong> that you have a good faith belief that the use is not authorized</li>
                  <li><strong>A statement</strong> that the information in the notification is accurate and, under penalty of perjury, that you are authorized to act on behalf of the copyright owner</li>
                  <li><strong>Your physical or electronic signature</strong></li>
                </ol>
              </div>

              <h3>2.2 Designated Agent</h3>
              <p>Send DMCA notices to:</p>
              <ul>
                <li><strong>Email:</strong> info@tapp-studio.cz</li>
                <li><strong>Address:</strong> DMCA Agent, Tapp Studio, Czech Republic</li>
              </ul>

              <h3>2.3 Response Time</h3>
              <p>We will respond to valid DMCA notices within 72 hours of receipt.</p>

              <h2>3. Counter-Notification Process</h2>
              
              <h3>3.1 If You Believe Content Was Wrongly Removed</h3>
              <p>If you believe content was removed due to a mistake or misidentification, you may file a counter-notification containing:</p>
              
              <ol>
                <li><strong>Your contact information</strong></li>
                <li><strong>Identification of the removed content</strong> and its previous location</li>
                <li><strong>A statement under penalty of perjury</strong> that you have a good faith belief the content was removed due to mistake or misidentification</li>
                <li><strong>Your consent</strong> to the jurisdiction of the federal district court</li>
                <li><strong>Your physical or electronic signature</strong></li>
              </ol>

              <h3>3.2 Counter-Notice Response</h3>
              <p>Upon receipt of a valid counter-notification, we may restore the content unless the original complainant files a court action within 10 business days.</p>

              <h2>4. Repeat Infringer Policy</h2>
              
              <h3>4.1 Account Termination</h3>
              <p>We have a policy of terminating accounts of users who are repeat infringers. This includes:</p>
              <ul>
                <li>Users who receive multiple valid DMCA notices</li>
                <li>Users who repeatedly violate our Terms of Service regarding copyright</li>
                <li>Users who ignore copyright warnings</li>
              </ul>

              <h3>4.2 Appeal Process</h3>
              <p>Terminated users may appeal the decision by contacting info@tapp-studio.cz with evidence that the infringement claims were invalid.</p>

              <h2>5. YouTube-Specific Considerations</h2>
              
              <h3>5.1 YouTube Terms of Service</h3>
              <p>When users import content from YouTube using WallMotion:</p>
              <ul>
                <li>They must comply with YouTube&apos;s Terms of Service</li>
                <li>They should only download content they own or have permission to use</li>
                <li>They bear full responsibility for any violations</li>
              </ul>

              <h3>5.2 YouTube Content ID</h3>
              <p>Content identified by YouTube&apos;s Content ID system may be subject to additional restrictions. Users should respect these restrictions.</p>

              <h2>6. International Copyright Laws</h2>
              <p>Users must comply with copyright laws in their jurisdiction, including:</p>
              <ul>
                <li>EU Copyright Directive</li>
                <li>UK Copyright, Designs and Patents Act</li>
                <li>Other applicable national laws</li>
              </ul>

              <h2>7. Educational Resources</h2>
              <p>We provide resources to help users understand copyright:</p>
              <ul>
                <li>Links to copyright education materials</li>
                <li>Guidelines for identifying copyrighted content</li>
                <li>Information about Creative Commons licenses</li>
              </ul>

              <h2>8. Contact Information</h2>
              <p>For DMCA-related matters:</p>
              <ul>
                <li><strong>DMCA Agent:</strong> info@tapp-studio.cz</li>
                <li><strong>General Legal:</strong> info@tapp-studio.cz</li>
                <li><strong>Response time:</strong> Within 72 hours</li>
              </ul>

              <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-8">
                <p className="font-semibold text-red-800">
                  This DMCA Policy is part of our Terms of Service and is incorporated by reference.
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