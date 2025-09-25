import TopBar from "@/components/TopBar";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function PublisherTermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 to-blue-600/20 dark:from-slate-900 dark:to-blue-900/40">
      <TopBar />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-background to-muted">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Publisher Terms of Service
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-8">
              <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                  <p>
                    By accessing and using CoinAds as a publisher, you agree to be bound by these 
                    Publisher Terms of Service ("Terms"). If you do not agree to these Terms, you 
                    may not use our services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">2. Publisher Eligibility</h2>
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
                  <h2 className="text-2xl font-semibold text-foreground mb-4">3. Ad Placement and Content</h2>
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
                  <h2 className="text-2xl font-semibold text-foreground mb-4">4. Payment Terms</h2>
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
                  <h2 className="text-2xl font-semibold text-foreground mb-4">5. Prohibited Content</h2>
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
                  <h2 className="text-2xl font-semibold text-foreground mb-4">6. Traffic Quality</h2>
                  <p className="mb-4">Publishers must ensure:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>All traffic is legitimate and organic</li>
                    <li>No use of bots, automated traffic, or incentivized clicks</li>
                    <li>Compliance with our fraud detection systems</li>
                    <li>Transparent reporting of traffic sources</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">7. Termination</h2>
                  <p>
                    Either party may terminate this agreement at any time with 30 days notice. 
                    CoinAds reserves the right to immediately suspend or terminate accounts 
                    that violate these terms or engage in fraudulent activity.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitation of Liability</h2>
                  <p>
                    CoinAds shall not be liable for any indirect, incidental, special, or 
                    consequential damages arising from the use of our services. Our total 
                    liability shall not exceed the amount paid to the publisher in the 
                    previous 12 months.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">9. Changes to Terms</h2>
                  <p>
                    CoinAds reserves the right to modify these terms at any time. Publishers 
                    will be notified of significant changes via email. Continued use of our 
                    services constitutes acceptance of the modified terms.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact Information</h2>
                  <p className="mb-4">
                    For questions about these terms, please contact us:
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <p><strong>Email:</strong> legal@coinads.com</p>
                    <p><strong>Address:</strong> Saadya Gaon 24, Tel Aviv, Israel</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 CoinAds. All rights reserved.</p>
            <div className="mt-4 space-x-6">
              <Link href="/legal/privacy" className="hover:text-foreground">Privacy Policy</Link>
              <Link href="/legal/advertiser-terms" className="hover:text-foreground">Advertiser Terms</Link>
              <Link href="/legal/publisher-terms" className="hover:text-foreground">Publisher Terms</Link>
              <Link href="/legal/cookies" className="hover:text-foreground">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}