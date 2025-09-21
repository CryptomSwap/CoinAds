import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { ArrowRight } from "lucide-react";

export default function AdvertiserTermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="h-16 bg-background border-b border-border">
        <div className="mx-auto max-w-6xl px-6 h-full">
          <div className="flex items-center justify-between h-full">
            <Logo className="text-foreground" />
            <div className="flex items-center space-x-8">
              <Link href="/auth/signin">
                <Button>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white text-3xl">Advertiser Terms of Service</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                Last updated: January 15, 2024
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <div className="text-slate-600 dark:text-slate-300 space-y-6">
                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
                  <p>
                    By accessing and using CoinAds as an advertiser, you agree to be bound by these Terms of Service. 
                    If you do not agree to these terms, you may not use our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">2. Account Registration</h2>
                  <p>To use our advertising services, you must:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Provide accurate and complete registration information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Notify us immediately of any unauthorized use</li>
                    <li>Be at least 18 years old or have parental consent</li>
                    <li>Comply with all applicable laws and regulations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">3. Advertising Guidelines</h2>
                  <p>All advertisements must comply with our content policies:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>No misleading or deceptive content</li>
                    <li>No illegal or harmful products/services</li>
                    <li>No adult content or gambling (unless explicitly approved)</li>
                    <li>No malware or malicious software</li>
                    <li>No trademark or copyright infringement</li>
                    <li>Compliance with applicable advertising standards</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">4. Payment Terms</h2>
                  <p>
                    Advertisers are required to maintain sufficient funds in their wallet to cover campaign costs. 
                    Payment terms include:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Prepayment required for all campaigns</li>
                    <li>Automatic deduction for impressions and clicks</li>
                    <li>No refunds for delivered impressions</li>
                    <li>Payment processing fees may apply</li>
                    <li>Currency conversion rates apply for international payments</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">5. Campaign Performance</h2>
                  <p>
                    While we strive to deliver campaigns as specified, we cannot guarantee:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Exact impression delivery numbers</li>
                    <li>Specific click-through rates</li>
                    <li>Conversion rates or business outcomes</li>
                    <li>Placement on specific sites or pages</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">6. Intellectual Property</h2>
                  <p>
                    You retain ownership of your creative materials. By uploading content, you grant us a 
                    non-exclusive license to display your ads on our platform. You warrant that you have 
                    all necessary rights to use and display your creative materials.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">7. Prohibited Activities</h2>
                  <p>The following activities are strictly prohibited:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Click fraud or impression manipulation</li>
                    <li>Circumventing our systems or policies</li>
                    <li>Creating multiple accounts to evade restrictions</li>
                    <li>Reverse engineering our platform</li>
                    <li>Interfering with other advertisers' campaigns</li>
                    <li>Violating any applicable laws or regulations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">8. Suspension and Termination</h2>
                  <p>
                    We reserve the right to suspend or terminate your account for violations of these terms, 
                    suspicious activity, or non-payment. You may terminate your account at any time by 
                    contacting our support team.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">9. Limitation of Liability</h2>
                  <p>
                    CoinAds shall not be liable for any indirect, incidental, special, or consequential damages 
                    arising from your use of our services. Our total liability shall not exceed the amount 
                    you have paid us in the 12 months preceding the claim.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">10. Changes to Terms</h2>
                  <p>
                    We may modify these terms at any time. Material changes will be communicated via email 
                    or platform notification. Continued use of our services constitutes acceptance of the 
                    updated terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">11. Contact Information</h2>
                  <p>
                    For questions about these terms or our services, please contact us:
                  </p>
                  <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg mt-3">
                    <p><strong>Email:</strong> legal@coinads.com</p>
                    <p><strong>Support:</strong> support@coinads.com</p>
                    <p><strong>Address:</strong> 123 Market Street, Suite 100, San Francisco, CA 94105</p>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="text-center text-slate-500 dark:text-slate-400">
            <p>&copy; 2024 CoinAds. All rights reserved.</p>
            <div className="mt-4 space-x-6">
              <Link href="/legal/privacy" className="hover:text-slate-900 dark:hover:text-white">Privacy Policy</Link>
              <Link href="/legal/advertiser-terms" className="hover:text-slate-900 dark:hover:text-white">Advertiser Terms</Link>
              <Link href="/legal/publisher-terms" className="hover:text-slate-900 dark:hover:text-white">Publisher Terms</Link>
              <Link href="/legal/cookies" className="hover:text-slate-900 dark:hover:text-white">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
