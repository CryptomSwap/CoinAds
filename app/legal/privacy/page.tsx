import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { ArrowRight } from "lucide-react";

export default function PrivacyPolicyPage() {
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
              <CardTitle className="text-slate-900 dark:text-white text-3xl">Privacy Policy</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                Last updated: January 15, 2024
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <div className="text-slate-600 dark:text-slate-300 space-y-6">
                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">1. Information We Collect</h2>
                  <p>
                    We collect information you provide directly to us, such as when you create an account, 
                    use our services, or contact us for support. This may include:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Account information (name, email address, company details)</li>
                    <li>Payment information (processed securely through Stripe and Coinbase Commerce)</li>
                    <li>Campaign and creative data</li>
                    <li>Website and placement information</li>
                    <li>Communication preferences</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">2. How We Use Your Information</h2>
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Send technical notices and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Monitor and analyze trends and usage</li>
                    <li>Detect, investigate, and prevent fraudulent transactions</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">3. Information Sharing</h2>
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to third parties 
                    without your consent, except as described in this policy. We may share your information:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>With service providers who assist us in operating our platform</li>
                    <li>When required by law or to protect our rights</li>
                    <li>In connection with a business transfer or acquisition</li>
                    <li>With your explicit consent</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">4. Data Security</h2>
                  <p>
                    We implement appropriate security measures to protect your personal information against 
                    unauthorized access, alteration, disclosure, or destruction. This includes:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and authentication</li>
                    <li>Secure payment processing</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">5. Cookies and Tracking</h2>
                  <p>
                    We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
                    and deliver personalized content. You can control cookie preferences through your browser settings.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">6. Your Rights</h2>
                  <p>You have the right to:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Access and update your personal information</li>
                    <li>Request deletion of your account and data</li>
                    <li>Opt out of marketing communications</li>
                    <li>Request a copy of your data</li>
                    <li>Object to certain processing activities</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">7. International Transfers</h2>
                  <p>
                    Your information may be transferred to and processed in countries other than your own. 
                    We ensure appropriate safeguards are in place to protect your data during such transfers.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">8. Changes to This Policy</h2>
                  <p>
                    We may update this privacy policy from time to time. We will notify you of any material 
                    changes by posting the new policy on this page and updating the "Last updated" date.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">9. Contact Us</h2>
                  <p>
                    If you have any questions about this privacy policy or our data practices, please contact us at:
                  </p>
                  <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg mt-3">
                    <p><strong>Email:</strong> privacy@coinads.com</p>
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
