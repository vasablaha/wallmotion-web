// app/cookies/page.tsx
"use client"
import Navbar from '../components/NavBar'
import Footer from '@/app/components/Footer'

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
                when you use WallMotion and visit our website wallmotion.app.
              </p>

              <h2>2. What Are Cookies</h2>
              <p>
                Cookies are small text files placed on your device by websites you visit. They help websites remember 
                your preferences and provide a better user experience.
              </p>

              <h2>3. Types of Cookies We Use</h2>
              
              <h3>3.1 Essential Cookies</h3>
              <p>These cookies are necessary for basic functionality:</p>
              <ul>
                <li><strong>Authentication:</strong> Remember your login status</li>
                <li><strong>Security:</strong> Prevent unauthorized access</li>
                <li><strong>Session Management:</strong> Maintain your session across pages</li>
              </ul>

              <h3>3.2 Performance Cookies</h3>
              <p>These cookies help us understand how you use our service:</p>
              <ul>
                <li><strong>Analytics:</strong> Track usage patterns and popular features</li>
                <li><strong>Error Monitoring:</strong> Identify and fix technical issues</li>
                <li><strong>Performance Metrics:</strong> Measure application speed and reliability</li>
              </ul>

              <h3>3.3 Preference Cookies</h3>
              <p>These cookies remember your choices:</p>
              <ul>
                <li><strong>Settings:</strong> Your preferred language and display options</li>
                <li><strong>Customization:</strong> Your personalized configurations</li>
                <li><strong>Theme:</strong> Your preferred light/dark mode</li>
              </ul>

              <h3>3.4 Marketing Cookies (Optional)</h3>
              <p>These cookies help us show relevant content:</p>
              <ul>
                <li><strong>Advertising:</strong> Display relevant ads (with your consent)</li>
                <li><strong>Analytics:</strong> Measure marketing campaign effectiveness</li>
                <li><strong>Personalization:</strong> Customize content based on your interests</li>
              </ul>

              <h2>4. Third-Party Cookies</h2>
              <p>We may use third-party services that set their own cookies:</p>
              <ul>
                <li><strong>Stripe:</strong> Payment processing and fraud prevention</li>
                <li><strong>Google Analytics:</strong> Website analytics (if enabled)</li>
                <li><strong>AWS:</strong> Authentication and hosting services</li>
              </ul>

              <h2>5. Managing Cookies</h2>
              
              <h3>5.1 Browser Settings</h3>
              <p>You can control cookies through your browser settings:</p>
              <ul>
                <li><strong>Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies and other site data</li>
                <li><strong>Firefox:</strong> Preferences &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data</li>
              </ul>

              <h3>5.2 Our Cookie Preferences</h3>
              <p>You can manage cookie preferences through:</p>
              <ul>
                <li>Cookie banner on first visit</li>
                <li>Cookie preferences in your account settings</li>
                <li>Contact us at info@tapp-studio.cz</li>
              </ul>

              <h3>5.3 Disabling Cookies</h3>
              <p>You can disable cookies, but this may affect functionality:</p>
              <ul>
                <li>Authentication may not work properly</li>
                <li>Your preferences won&apos;t be remembered</li>
                <li>Some features may be unavailable</li>
              </ul>

              <h2>6. Cookie Retention</h2>
              
              <h3>6.1 Session Cookies</h3>
              <p>Deleted when you close your browser</p>

              <h3>6.2 Persistent Cookies</h3>
              <p>Stored for specific periods:</p>
              <ul>
                <li><strong>Authentication:</strong> 30 days</li>
                <li><strong>Preferences:</strong> 1 year</li>
                <li><strong>Analytics:</strong> 2 years</li>
              </ul>

              <h2>7. Updates to This Policy</h2>
              <p>We may update this Cookie Policy to reflect:</p>
              <ul>
                <li>Changes in our cookie usage</li>
                <li>New features or services</li>
                <li>Legal requirements</li>
              </ul>

              <h2>8. Contact Information</h2>
              <p>For questions about cookies:</p>
              <ul>
                <li><strong>Email:</strong> info@tapp-studio.cz</li>
                <li><strong>Cookie Preferences:</strong> Available in your account settings</li>
              </ul>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-8">
                <p className="font-semibold text-green-800">
                  By continuing to use WallMotion, you consent to our use of cookies as described in this policy.
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