import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { ArrowRight } from "lucide-react";

export default function CookiePolicyPage() {
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
              <CardTitle className="text-white text-3xl">Cookie Policy</CardTitle>
              <CardDescription className="text-slate-300">
                Last updated: January 1, 2024
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 text-slate-300">
              <div>
                <h2 className="text-white text-xl font-semibold mb-4">What Are Cookies?</h2>
                <p>
                  Cookies are small text files that are stored on your device when you visit 
                  our website. They help us provide you with a better experience by remembering 
                  your preferences and enabling certain functionality.
                </p>
              </div>

              <div>
                <h2 className="text-white text-xl font-semibold mb-4">How We Use Cookies</h2>
                <p className="mb-4">CoinAds uses cookies for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                  <li><strong>Advertising Cookies:</strong> Enable targeted advertising and ad delivery</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Security Cookies:</strong> Protect against fraud and unauthorized access</li>
                </ul>
              </div>

              <div>
                <h2 className="text-white text-xl font-semibold mb-4">Types of Cookies We Use</h2>
                
                <div className="space-y-6">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Essential Cookies</h3>
                    <p className="mb-2">These cookies are necessary for the website to function properly.</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Session management</li>
                      <li>Authentication</li>
                      <li>Security features</li>
                      <li>Load balancing</li>
                    </ul>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Analytics Cookies</h3>
                    <p className="mb-2">These cookies help us understand website usage and performance.</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Google Analytics</li>
                      <li>Page views and user behavior</li>
                      <li>Performance monitoring</li>
                      <li>Error tracking</li>
                    </ul>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Advertising Cookies</h3>
                    <p className="mb-2">These cookies enable targeted advertising and ad delivery.</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Ad targeting and personalization</li>
                      <li>Frequency capping</li>
                      <li>Conversion tracking</li>
                      <li>Cross-site advertising</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-white text-xl font-semibold mb-4">Third-Party Cookies</h2>
                <p className="mb-4">We may use third-party services that set their own cookies:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Google Analytics:</strong> Website analytics and performance tracking</li>
                  <li><strong>Google Ads:</strong> Advertising and conversion tracking</li>
                  <li><strong>Facebook Pixel:</strong> Social media advertising and analytics</li>
                  <li><strong>Stripe:</strong> Payment processing and fraud prevention</li>
                  <li><strong>Intercom:</strong> Customer support and chat functionality</li>
                </ul>
              </div>

              <div>
                <h2 className="text-white text-xl font-semibold mb-4">Managing Cookies</h2>
                <p className="mb-4">You can control cookies through your browser settings:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Block all cookies</li>
                  <li>Block third-party cookies only</li>
                  <li>Delete existing cookies</li>
                  <li>Set cookie preferences</li>
                </ul>
                <p className="mt-4">
                  <strong>Note:</strong> Disabling cookies may affect website functionality and 
                  your user experience.
                </p>
              </div>

              <div>
                <h2 className="text-white text-xl font-semibold mb-4">Browser-Specific Instructions</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-semibold mb-2">Google Chrome</h3>
                    <p className="text-sm">Settings → Privacy and security → Cookies and other site data</p>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-semibold mb-2">Mozilla Firefox</h3>
                    <p className="text-sm">Options → Privacy & Security → Cookies and Site Data</p>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-semibold mb-2">Safari</h3>
                    <p className="text-sm">Preferences → Privacy → Manage Website Data</p>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-semibold mb-2">Microsoft Edge</h3>
                    <p className="text-sm">Settings → Cookies and site permissions → Cookies and site data</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-white text-xl font-semibold mb-4">Updates to This Policy</h2>
                <p>
                  We may update this Cookie Policy from time to time. We will notify you of 
                  any significant changes by posting the new policy on our website and updating 
                  the "Last updated" date.
                </p>
              </div>

              <div>
                <h2 className="text-white text-xl font-semibold mb-4">Contact Us</h2>
                <p>
                  If you have any questions about our use of cookies, please contact us at:
                  <br />
                  Email: privacy@coinads.com
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
