// app/refund/page.tsx
"use client"
import Navbar from '../components/NavBar'
import Footer from '@/app/components/Footer'

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isScrolled={true} onPurchase={async () => {}} />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Refund Policy</h1>
            <p className="text-gray-600 mb-8">Last Updated: January 2025</p>

            <div className="prose text-black prose-lg max-w-none">
              <h2>1. Overview</h2>
              <p>
                At Tapp Studio, we want you to be completely satisfied with WallMotion. This Refund Policy explains 
                when and how you can request a refund for your purchase.
              </p>

              <h2>2. 30-Day Money-Back Guarantee</h2>
              
              <h3>2.1 Eligibility Period</h3>
              <ul>
                <li><strong>Refund window:</strong> 30 days from the date of purchase</li>
                <li><strong>Calculation:</strong> Based on the original transaction date in your receipt</li>
                <li><strong>No questions asked:</strong> Full refund within the first 30 days</li>
              </ul>

              <h3>2.2 What&apos;s Covered</h3>
              <ul>
                <li>Technical issues preventing proper use of the software</li>
                <li>Compatibility problems with your macOS version</li>
                <li>Unsatisfactory performance or functionality</li>
                <li>Any other reason within the 30-day window</li>
              </ul>

              <h2>3. Refund Process</h2>
              
              <h3>3.1 How to Request a Refund</h3>
              <ol>
                <li><strong>Email us</strong> at info@tapp-studio.cz</li>
                <li><strong>Include your order information:</strong>
                  <ul>
                    <li>Purchase date and amount</li>
                    <li>Email address used for purchase</li>
                    <li>Stripe transaction ID (if available)</li>
                    <li>Brief reason for refund (optional)</li>
                  </ul>
                </li>
              </ol>

              <h3>3.2 Processing Time</h3>
              <ul>
                <li><strong>Acknowledgment:</strong> Within 24 hours</li>
                <li><strong>Review:</strong> 2-3 business days</li>
                <li><strong>Refund completion:</strong> 5-10 business days (depends on payment method)</li>
              </ul>

              <h3>3.3 Refund Method</h3>
              <ul>
                <li><strong>Same payment method:</strong> Refund will be processed to the original payment method</li>
                <li><strong>Credit card:</strong> 3-5 business days</li>
                <li><strong>Bank transfer:</strong> 5-10 business days</li>
                <li><strong>Digital wallets:</strong> 1-3 business days</li>
              </ul>

              <h2>4. Conditions and Limitations</h2>
              
              <h3>4.1 Time Limitations</h3>
              <ul>
                <li><strong>After 30 days:</strong> Refunds are generally not available</li>
                <li><strong>Exceptions:</strong> May be considered for technical issues or extraordinary circumstances</li>
                <li><strong>Documentation:</strong> May require proof of technical problems</li>
              </ul>

              <h3>4.2 Usage Limitations</h3>
              <ul>
                <li><strong>No usage restrictions:</strong> You can use the software and still get a refund within 30 days</li>
                <li><strong>License revocation:</strong> Upon refund, your license will be deactivated</li>
                <li><strong>Device removal:</strong> All registered devices will be removed</li>
              </ul>

              <h3>4.3 Partial Refunds</h3>
              <ul>
                <li><strong>Multiple licenses:</strong> Refund only for unused licenses</li>
                <li><strong>Bulk purchases:</strong> Partial refunds available for qualifying portions</li>
                <li><strong>Prorated refunds:</strong> Not applicable (one-time payment model)</li>
              </ul>

              <h2>5. Non-Refundable Situations</h2>
              
              <h3>5.1 Beyond Our Control</h3>
              <ul>
                <li><strong>System requirement changes:</strong> After macOS updates</li>
                <li><strong>Third-party service changes:</strong> YouTube policy changes, etc.</li>
                <li><strong>User error:</strong> Incorrect usage or misunderstanding of features</li>
              </ul>

              <h3>5.2 Abuse Prevention</h3>
              <ul>
                <li><strong>Repeated refunds:</strong> Multiple refund requests may be declined</li>
                <li><strong>Fraudulent activity:</strong> Suspected fraud will result in refund denial</li>
                <li><strong>Chargebacks:</strong> Disputed charges through payment provider</li>
              </ul>

              <h2>6. Technical Support Alternative</h2>
              
              <h3>6.1 Before Requesting Refund</h3>
              <p>We encourage you to contact our support team first:</p>
              <ul>
                <li><strong>Email:</strong> info@tapp-studio.cz</li>
                <li><strong>Common issues:</strong> Often resolved quickly</li>
                <li><strong>Tutorials:</strong> Available at wallmotion.app/help</li>
              </ul>

              <h3>6.2 Extended Support</h3>
              <ul>
                <li><strong>Installation help:</strong> Free installation assistance</li>
                <li><strong>Troubleshooting:</strong> Comprehensive technical support</li>
                <li><strong>Feature guidance:</strong> Help with using all features</li>
              </ul>

              <h2>7. International Considerations</h2>
              
              <h3>7.1 Consumer Rights</h3>
              <ul>
                <li><strong>EU customers:</strong> Additional rights under EU consumer law</li>
                <li><strong>UK customers:</strong> Rights under UK consumer protection legislation</li>
                <li><strong>Other regions:</strong> Local consumer protection laws apply</li>
              </ul>

              <h3>7.2 Currency and Exchange</h3>
              <ul>
                <li><strong>Original currency:</strong> Refunds processed in original purchase currency</li>
                <li><strong>Exchange rates:</strong> No compensation for currency fluctuations</li>
                <li><strong>International fees:</strong> May apply depending on payment method</li>
              </ul>

              <h2>8. Contact Information</h2>
              <p>For refund requests and questions:</p>
              <ul>
                <li><strong>Email:</strong> info@tapp-studio.cz</li>
                <li><strong>Response time:</strong> Within 24 hours</li>
              </ul>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
                <p className="font-semibold text-blue-800">
                  This Refund Policy is part of our Terms of Service and constitutes a legally binding agreement between you and Tapp Studio.
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