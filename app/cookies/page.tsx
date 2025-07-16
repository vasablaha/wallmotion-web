// app/cookies/page.tsx
"use client"
import Navbar from '../components/NavBar'
import Footer from '@/app/components/Footer'
import Link from 'next/link'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isScrolled={true} onPurchase={async () => {}} />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
            <p className="text-gray-600 mb-8">Last Updated: January 2025</p>

            <div className="prose text-black prose-lg max-w-none">
              <h2>1. Introduction</h2>
              <p>
                This Cookie Policy explains how Tapp Studio (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) uses cookies and similar technologies 
                when you use WallMotion and visit our website wallmotion.app. We use Cookiebot to manage your cookie preferences and ensure GDPR compliance.
              </p>

              <h2>2. What Are Cookies</h2>
              <p>
                Cookies are small text files placed on your device by websites you visit. They help websites remember 
                your preferences and provide a better user experience. We only use cookies that are essential for our service 
                or cookies you have specifically consented to.
              </p>

              <h2>3. Types of Cookies We Use</h2>
              
              <h3>3.1 Essential Cookies (Always Active)</h3>
              <p>These cookies are necessary for basic functionality and cannot be disabled:</p>
              <ul>
                <li><strong>Authentication:</strong> Remember your login status and secure your session</li>
                <li><strong>Security:</strong> Prevent unauthorized access and protect against fraud</li>
                <li><strong>Session Management:</strong> Maintain your session across pages</li>
                <li><strong>Cookiebot:</strong> Remember your cookie preferences and consent choices</li>
              </ul>

              <h3>3.2 Performance Cookies (Optional - Requires Consent)</h3>
              <p>These cookies help us understand how you use our service and are only active if you consent:</p>
              <ul>
                <li><strong>Google Analytics:</strong> Track usage patterns, popular features, and site performance</li>
                <li><strong>Error Monitoring:</strong> Identify and fix technical issues</li>
                <li><strong>Performance Metrics:</strong> Measure application speed and reliability</li>
              </ul>

              <h3>3.3 Preference Cookies (Optional - Requires Consent)</h3>
              <p>These cookies remember your choices and are only active if you consent:</p>
              <ul>
                <li><strong>Language Settings:</strong> Your preferred language and display options</li>
                <li><strong>Theme Preferences:</strong> Your preferred light/dark mode</li>
                <li><strong>UI Customization:</strong> Your personalized configurations</li>
              </ul>

              <h3>3.4 Marketing Cookies (Optional - Requires Consent)</h3>
              <p>We currently do not use marketing cookies, but if we do in the future, they will require your explicit consent:</p>
              <ul>
                <li><strong>Advertising:</strong> Display relevant ads (not currently used)</li>
                <li><strong>Campaign Analytics:</strong> Measure marketing effectiveness (not currently used)</li>
                <li><strong>Personalization:</strong> Customize content based on interests (not currently used)</li>
              </ul>

              <h2>4. Third-Party Cookies</h2>
              <p>We use the following third-party services that may set cookies (only with your consent where required):</p>
              <ul>
                <li><strong>Stripe:</strong> Payment processing and fraud prevention (essential for purchases)</li>
                <li><strong>Google Analytics:</strong> Website analytics (requires consent)</li>
                <li><strong>AWS Amplify:</strong> Authentication and hosting services (essential for app functionality)</li>
                <li><strong>Cookiebot:</strong> Cookie consent management (essential for privacy compliance)</li>
              </ul>

              <h2>5. Managing Your Cookie Preferences</h2>
              
              <h3>5.1 Cookiebot Consent Banner</h3>
              <p>When you first visit our website, you will see a cookie consent banner powered by Cookiebot. You can:</p>
              <ul>
                <li>Accept all cookies</li>
                <li>Reject non-essential cookies</li>
                <li>Customize your preferences by category</li>
                <li>View detailed information about each cookie</li>
              </ul>

              <h3>5.2 Changing Your Preferences</h3>
              <p>You can change your cookie preferences at any time by:</p>
              <ul>
                <li>Clicking the &quot;Cookie Settings&quot; link in our footer</li>
                <li>Visiting our <Link href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link> page and clicking &quot;Manage Cookies&quot;</li>
                <li>Contacting us at <a href="mailto:info@tapp-studio.cz" className="text-blue-600 hover:text-blue-800">info@tapp-studio.cz</a></li>
              </ul>

              <h3>5.3 Browser Settings</h3>
              <p>You can also control cookies through your browser settings:</p>
              <ul>
                <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Preferences → Privacy &amp; Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
              </ul>

              <h3>5.4 Impact of Disabling Cookies</h3>
              <p>If you disable cookies, some functionality may be affected:</p>
              <ul>
                <li>You may need to log in repeatedly</li>
                <li>Your preferences won&apos;t be remembered</li>
                <li>Some features may not work properly</li>
                <li>We cannot remember your cookie preferences</li>
              </ul>

              <h2>6. Cookie Retention Periods</h2>
              
              <h3>6.1 Session Cookies</h3>
              <p>Automatically deleted when you close your browser</p>

              <h3>6.2 Persistent Cookies</h3>
              <p>Stored for specific periods based on their purpose:</p>
              <ul>
                <li><strong>Authentication:</strong> Up to 30 days</li>
                <li><strong>Cookie Preferences:</strong> 12 months</li>
                <li><strong>Analytics:</strong> Up to 24 months (Google Analytics)</li>
                <li><strong>Security:</strong> Up to 30 days</li>
              </ul>

              <h2>7. International Data Transfers</h2>
              <p>Some of our cookie-related services may transfer data internationally:</p>
              <ul>
                <li><strong>Google Analytics:</strong> Data may be processed in the US with appropriate safeguards</li>
                <li><strong>AWS:</strong> Data processed in EU regions where possible</li>
                <li><strong>Stripe:</strong> Payment data processed with appropriate security measures</li>
              </ul>

              <h2>8. Updates to This Cookie Policy</h2>
              <p>We may update this Cookie Policy to reflect:</p>
              <ul>
                <li>Changes in our cookie usage</li>
                <li>New features or services</li>
                <li>Legal requirements</li>
                <li>Updates to third-party services</li>
              </ul>
              <p>We will notify you of significant changes through our website or by email.</p>

              <h2>9. Your Rights Under GDPR</h2>
              <p>If you are in the EU, you have the following rights regarding cookies:</p>
              <ul>
                <li><strong>Consent:</strong> Right to give or withdraw consent for non-essential cookies</li>
                <li><strong>Access:</strong> Right to know what cookies we use and why</li>
                <li><strong>Portability:</strong> Right to receive your cookie preference data</li>
                <li><strong>Deletion:</strong> Right to have your cookie data deleted</li>
              </ul>

              <h2>10. Contact Information</h2>
              <p>For questions about cookies or to exercise your rights:</p>
              <ul>
                <li><strong>Email:</strong> <a href="mailto:info@tapp-studio.cz" className="text-blue-600 hover:text-blue-800">info@tapp-studio.cz</a></li>
                <li><strong>Subject:</strong> Cookie Policy Question</li>
                <li><strong>Response Time:</strong> Within 72 hours</li>
              </ul>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
                <p className="font-semibold text-blue-800">
                  <strong>Important:</strong> By using WallMotion, you agree to our use of essential cookies. 
                  For all other cookies, we will ask for your specific consent through our Cookiebot banner.
                </p>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Need to change your cookie preferences?</strong> 
                  <br />
                  You can update your preferences at any time by clicking the &quot;Cookie Settings&quot; link in our footer 
                  or by clearing your browser cookies and revisiting our site.
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