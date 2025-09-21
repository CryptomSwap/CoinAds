import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { ArrowRight } from "lucide-react";

export default function PublisherTermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F12] to-[#1a1a2e]">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo className="text-white" />
            <div className="flex items-center space-x-4">
              <Link href="/advertisers">
                <Button variant="ghost" className="text-white hover:text-teal-300">
                  For Advertisers
                </Button>
              </Link>
              <Link href="/publishers">
                <Button variant="ghost" className="text-white hover:text-teal-300">
                  For Publishers
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button className="bg-gradient-brand bg-gradient-brand-hover">
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-3xl">Publisher Terms of Service</CardTitle>
              <CardDescription className="text-slate-300">
                Last updated: January 1, 2024
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 text-slate-300">
              <div>
                <h2 className="text-white text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using CoinAds as a publisher, you agree to be bound by these 
                  Publisher Terms of Service ("Terms"). If you do not agree to these Terms, you 
                  may not use our services.
                </p>
              </div>

              <div>
                <h2 className="text-white text-xl font-semibold mb-4">2. Publisher Eligibility</h2>
                <p className="mb-4">To become a CoinAds publisher, you must:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Own or operate a website with crypto, blockchain, or related content</li>
                  <li>Have a minimum of 10,000 monthly unique visitors</li>
                  <li>Maintain a professional, well-designed website</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Not engage in fraudulent or deceptive practices</li>
                </ul>
              </div>

              <div>
                <h2 className="text-white text-xl font-semibold mb-4">3. Ad Placement and Content</h2>
                <p className="mb-4">Publishers agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Place ads only in approved locations on their websites</li>
                  <li>Not modify, alter, or interfere with ad code</li>
                  <li>Not click on their own ads or encourage others to do so</li>
                  <li>Maintain content that is appropriate and brand-safe</li>
                  <li>Not display ads on pages with prohibited content</li>
                </ul>
              </div>

              <div>
                <h2 className="text-white text-xl font-semibold mb-4">4. Payment Terms</h2>
                <p className="mb-4">Payment terms include:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Net 30 payment terms for approved publishers</li>
                  <li>Minimum payout threshold of $100 USD</li>
                  <li>Payments made via bank transfer, PayPal, or cryptocurrency</li>
                  <li>Revenue sharing based on negotiated rates</li>
                  <li>Deductions for invalid traffic or policy violations</li>
                </ul>
              </div>

              <div>
                <h2 className="text-white text-xl font-semibold mb-4">5. Prohibited Content</h2>
                <p className="mb-4">Publishers may not display ads on pages containing:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Adult content or pornography</li>
                  <li>Violence or graphic content</li>
                  <li>Hate speech or discriminatory content</li>
                  <li>Illegal activities or content</li>
                  <li>Malware or phishing attempts</li>
                  <li>Copyright infringement</li>
                </ul>
              </div>

              <div>
                <h2 className="text-white text-xl font-semibold mb-4">6. Traffic Quality</h2>
                <p className="mb-4">Publishers must ensure:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All traffic is legitimate and organic</li>
                  <li>No use of bots, automated traffic, or incentivized clicks</li>
                  <li>Compliance with our fraud detection systems</li>
                  <li>Transparent reporting of traffic sources</li>
                </ul>
              </div>

              <div>
                <h2 className="text-white text-xl font-semibold mb-4">7. Termination</h2>
                <p>
                  Either party may terminate this agreement at any time with 30 days notice. 
                  CoinAds reserves the right to immediately suspend or terminate accounts 
                  that violate these terms or engage in fraudulent activity.
                </p>
              </div>

              <div>
                <h2 className="text-white text-xl font-semibold mb-4">8. Limitation of Liability</h2>
                <p>
                  CoinAds shall not be liable for any indirect, incidental, special, or 
                  consequential damages arising from the use of our services. Our total 
                  liability shall not exceed the amount paid to the publisher in the 
                  previous 12 months.
                </p>
              </div>

              <div>
                <h2 className="text-white text-xl font-semibold mb-4">9. Changes to Terms</h2>
                <p>
                  CoinAds reserves the right to modify these terms at any time. Publishers 
                  will be notified of significant changes via email. Continued use of our 
                  services constitutes acceptance of the modified terms.
                </p>
              </div>

              <div>
                <h2 className="text-white text-xl font-semibold mb-4">10. Contact Information</h2>
                <p>
                  For questions about these terms, please contact us at:
                  <br />
                  Email: legal@coinads.com
                  <br />
                  Address: 123 Market Street, Suite 100, San Francisco, CA 94105
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">CoinAds</h3>
              <p className="text-slate-300">
                The leading self-serve advertising platform for crypto companies.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link href="/advertisers">For Advertisers</Link></li>
                <li><Link href="/publishers">For Publishers</Link></li>
                <li><Link href="/ad-formats">Ad Formats</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/legal/privacy">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link href="/legal/advertiser-terms">Advertiser Terms</Link></li>
                <li><Link href="/legal/publisher-terms">Publisher Terms</Link></li>
                <li><Link href="/legal/cookies">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 CoinAds. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
