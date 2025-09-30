import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Globe, Shield } from "lucide-react";
import SiteActions from "@/components/wrappers/SiteActions";

// Disable SSG for authenticated app routes
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function NewSitePage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/app/publisher" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/app/publisher/sites" className="hover:text-foreground transition-colors">
            Sites
          </Link>
          <span>/</span>
          <span>Add New Site</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Website</h1>
        <p className="text-muted-foreground mt-2">
          Register your website to start displaying ads and earning revenue
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Website Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site-url">Website URL</Label>
                <Input 
                  id="site-url" 
                  type="url" 
                  placeholder="https://yourwebsite.com"
                  className="border-2 focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-name">Website Name</Label>
                <Input 
                  id="site-name" 
                  placeholder="Your Website Name"
                  className="border-2 focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description">Description</Label>
                <Textarea 
                  id="site-description"
                  placeholder="Describe your website content and audience"
                  rows={4}
                  className="border-2 focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site-category">Category</Label>
                  <Select>
                    <SelectTrigger className="border-2 focus:border-primary transition-colors">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="news">Crypto News</SelectItem>
                      <SelectItem value="trading">Trading & Investment</SelectItem>
                      <SelectItem value="blockchain">Blockchain Technology</SelectItem>
                      <SelectItem value="defi">DeFi & Finance</SelectItem>
                      <SelectItem value="nft">NFT & Gaming</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly-pageviews">Monthly Pageviews</Label>
                  <Select>
                    <SelectTrigger className="border-2 focus:border-primary transition-colors">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1k-10k">1K - 10K</SelectItem>
                      <SelectItem value="10k-50k">10K - 50K</SelectItem>
                      <SelectItem value="50k-100k">50K - 100K</SelectItem>
                      <SelectItem value="100k-500k">100K - 500K</SelectItem>
                      <SelectItem value="500k-1m">500K - 1M</SelectItem>
                      <SelectItem value="1m+">1M+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">TODO: Site Verification Process</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Domain ownership verification</li>
                  <li>• Content quality review</li>
                  <li>• Traffic analytics integration</li>
                  <li>• Ad placement guidelines</li>
                  <li>• Revenue sharing terms</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verification Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-sm">Submit Site Details</h4>
                  <p className="text-xs text-muted-foreground">
                    Provide basic information about your website
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-sm">Domain Verification</h4>
                  <p className="text-xs text-muted-foreground">
                    Verify ownership via DNS or file upload
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-sm">Content Review</h4>
                  <p className="text-xs text-muted-foreground">
                    Manual review for quality and compliance
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-sm">Start Earning</h4>
                  <p className="text-xs text-muted-foreground">
                    Generate ad tags and place on your site
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <span>Original, high-quality content</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <span>Minimum 1,000 monthly visitors</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <span>Crypto/blockchain related content</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <span>No adult, gambling, or illegal content</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <SiteActions />
    </div>
  );
}