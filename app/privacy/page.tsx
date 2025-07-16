// app/privacy/page.tsx
"use client"
import Navbar from '../components/NavBar'
import Footer from '@/app/components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isScrolled={true} onPurchase={async () => {}} />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
            <p className="text-gray-600 mb-8">Last Updated: January 2025</p>

            <div className="prose text-black prose-lg max-w-none">
              <h2>1. Introduction</h2>
              <p>
                Tapp Studio (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates WallMotion (&quot;the Application&quot;). This Privacy Policy explains 
                how we collect, use, and protect your personal information when you use our Application.
              </p>

              <h2>2. Information We Collect</h2>
              
              <h3>2.1 Personal Information</h3>
              <ul>
                <li><strong>Account Information:</strong> Email address, username, and password when you create an account</li>
                <li><strong>Payment Information:</strong> Processed securely through Stripe (we do not store payment details)</li>
                <li><strong>Device Information:</strong> Device identifiers for license management</li>
              </ul>

              <h3>2.2 Usage Information</h3>
              <ul>
                <li><strong>Application Usage:</strong> Features used, errors encountered, and performance metrics</li>
                <li><strong>Video Processing:</strong> Temporary storage of video files during processing (automatically deleted)</li>
                <li><strong>Log Files:</strong> Technical logs for debugging and security purposes</li>
              </ul>

              <h3>2.3 Automatically Collected Information</h3>
              <ul>
                <li><strong>Device Data:</strong> Operating system version, hardware specifications</li>
                <li><strong>Network Information:</strong> IP address, connection type</li>
                <li><strong>Crash Reports:</strong> Anonymous crash data to improve Application stability</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              
              <h3>3.1 Service Provision</h3>
              <ul>
                <li>Creating and managing your account</li>
                <li>Processing payments and managing licenses</li>
                <li>Providing customer support</li>
                <li>Delivering software updates</li>
              </ul>

              <h3>3.2 Improvement and Analytics</h3>
              <ul>
                <li>Analyzing usage patterns to improve the Application</li>
                <li>Identifying and fixing bugs</li>
                <li>Developing new features</li>
              </ul>

              <h3>3.3 Communications</h3>
              <ul>
                <li>Sending important service announcements</li>
                <li>Responding to your inquiries</li>
                <li>Marketing communications (with your consent)</li>
              </ul>

              <h2>4. Information Sharing</h2>
              
              <h3>4.1 Third-Party Services</h3>
              <p>We use the following third-party services:</p>
              <ul>
                <li><strong>Stripe:</strong> Payment processing (subject to Stripe&apos;s privacy policy)</li>
                <li><strong>AWS Cognito:</strong> Authentication services</li>
                <li><strong>MongoDB:</strong> Database hosting</li>
              </ul>

              <h3>4.2 Legal Requirements</h3>
              <p>We may disclose your information if required by law or to:</p>
              <ul>
                <li>Protect our rights and property</li>
                <li>Ensure user safety</li>
                <li>Comply with legal obligations</li>
                <li>Respond to government requests</li>
              </ul>

              <h2>5. Data Security</h2>
              
              <h3>5.1 Security Measures</h3>
              <ul>
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication systems</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information</li>
              </ul>

              <h3>5.2 Data Retention</h3>
              <ul>
                <li><strong>Account information:</strong> Retained while your account is active</li>
                <li><strong>Usage logs:</strong> Retained for 12 months</li>
                <li><strong>Video files:</strong> Automatically deleted after processing</li>
                <li><strong>Payment information:</strong> Retained as required by law</li>
              </ul>

              <h2>6. Your Rights (GDPR Compliance)</h2>
              
              <h3>6.1 Access Rights</h3>
              <ul>
                <li>Request access to your personal information</li>
                <li>Obtain a copy of your data</li>
              </ul>

              <h3>6.2 Correction Rights</h3>
              <ul>
                <li>Correct inaccurate personal information</li>
                <li>Update your account details</li>
              </ul>

              <h3>6.3 Deletion Rights</h3>
              <ul>
                <li>Request deletion of your personal information</li>
                <li>Close your account and delete associated data</li>
              </ul>

              <h2>7. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure adequate 
                protection through standard contractual clauses and other appropriate safeguards.
              </p>

              <h2>8. Children&apos;s Privacy</h2>
              <p>
                WallMotion is not intended for users under 13 years of age. We do not knowingly collect personal information 
                from children under 13.
              </p>

              <h2>9. Cookies and Tracking</h2>
              
              <h3>9.1 Cookies We Use</h3>
              <ul>
                <li><strong>Essential Cookies:</strong> Required for basic functionality</li>
                <li><strong>Performance Cookies:</strong> Help us understand how you use the Application</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>

              <h3>9.2 Managing Cookies</h3>
              <p>You can control cookies through your browser settings or by visiting our Cookie Preferences Center.</p>

              <h2>10. Updates to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by:</p>
              <ul>
                <li>Posting the updated policy on our website</li>
                <li>Sending email notifications</li>
                <li>Displaying in-app notifications</li>
              </ul>

              <h2>11. Contact Information</h2>
              <p>For privacy-related questions or to exercise your rights, contact us at:</p>
              <ul>
                <li><strong>Email:</strong> info@tapp-studio.cz</li>
                <li><strong>Address:</strong> Tapp Studio, Czech Republic</li>
              </ul>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
                <p className="font-semibold text-blue-800">
                  By using WallMotion, you acknowledge that you have read and understood this Privacy Policy.
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