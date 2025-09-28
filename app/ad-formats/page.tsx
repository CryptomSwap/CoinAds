"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { 
  ArrowRight, 
  Image, 
  Video, 
  FileText, 
  Smartphone, 
  Monitor,
  Tablet,
  CheckCircle,
  Zap,
  Target,
  BarChart3
} from "lucide-react";

export default function AdFormatsPage() {
  const adFormats = [
    {
      name: "Display Banners",
      icon: Image,
      description: "Traditional banner ads with high visibility and engagement",
      sizes: [
        { size: "300x250", name: "Medium Rectangle", cpm: "$2.50" },
        { size: "728x90", name: "Leaderboard", cpm: "$3.00" },
        { size: "970x250", name: "Billboard", cpm: "$4.00" },
        { size: "300x600", name: "Half Page", cpm: "$3.50" },
        { size: "160x600", name: "Wide Skyscraper", cpm: "$2.00" },
        { size: "320x50", name: "Mobile Banner", cpm: "$1.50" }
      ],
      features: ["High visibility", "Multiple sizes", "Responsive design", "Rich media support"],
      bestFor: "Brand awareness, product promotion, lead generation"
    },
    {
      name: "Native Ads",
      icon: FileText,
      description: "Seamlessly integrated content that matches your site design",
      sizes: [
        { size: "NATIVE", name: "Native Content", cpm: "$4.50" },
        { size: "NATIVE-VIDEO", name: "Native Video", cpm: "$6.00" },
        { size: "NATIVE-STORY", name: "Story Format", cpm: "$5.50" }
      ],
      features: ["Seamless integration", "Higher engagement", "Mobile optimized", "Content matching"],
      bestFor: "Content promotion, sponsored articles, native storytelling"
    },
    {
      name: "Video Ads",
      icon: Video,
      description: "High-impact video advertising with premium placement",
      sizes: [
        { size: "1920x1080", name: "Full HD Video", cpm: "$8.00" },
        { size: "1280x720", name: "HD Video", cpm: "$6.50" },
        { size: "640x360", name: "Mobile Video", cpm: "$5.00" }
      ],
      features: ["High engagement", "Premium placement", "Auto-play options", "Sound controls"],
      bestFor: "Brand storytelling, product demos, high-impact campaigns"
    },
    {
      name: "Sticky Ads",
      icon: Zap,
      description: "Persistent ads that stay visible as users scroll",
      sizes: [
        { size: "STICKY-TOP", name: "Sticky Header", cpm: "$7.00" },
        { size: "STICKY-SIDE", name: "Sticky Sidebar", cpm: "$5.50" },
        { size: "STICKY-BOTTOM", name: "Sticky Footer", cpm: "$6.00" }
      ],
      features: ["Always visible", "High viewability", "Non-intrusive", "Mobile friendly"],
      bestFor: "Persistent branding, call-to-action campaigns, mobile optimization"
    }
  ];

  const devices = [
    { name: "Desktop", icon: Monitor, description: "Full desktop experience with large formats" },
    { name: "Tablet", icon: Tablet, description: "Optimized for tablet viewing and interaction" },
    { name: "Mobile", icon: Smartphone, description: "Mobile-first design with touch optimization" }
  ];

  const targetingOptions = [
    { name: "Geographic", description: "Target by country, region, or city" },
    { name: "Demographic", description: "Age, gender, income, and interests" },
    { name: "Behavioral", description: "Browsing history and online behavior" },
    { name: "Contextual", description: "Content relevance and site categories" },
    { name: "Device", description: "Desktop, mobile, tablet targeting" },
    { name: "Time-based", description: "Day of week, time of day targeting" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 to-blue-600/20 dark:from-slate-900 dark:to-blue-900/40">
      {/* Navigation */}
      <nav className="h-16 bg-background border-b border-border">
        <div className="mx-auto max-w-6xl px-6 h-full">
          <div className="flex items-center justify-between h-full">
            <Logo className="text-foreground" />
            <div className="flex items-center space-x-8">
              <Link 
                href="/advertisers" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-advertisers"
              >
                For Advertisers
              </Link>
              <Link 
                href="/publishers" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-publishers"
              >
                For Publishers
              </Link>
              <Button asChild data-testid="sign-in">
                <Link href="/auth/signin">
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight mb-6">
          Ad Formats & Specifications
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Choose from our comprehensive range of ad formats designed for maximum engagement 
          and performance across all devices and platforms.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild size="lg" data-testid="start-advertising-cta">
            <Link href="/auth/signup?role=advertiser">
              Start Advertising
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" data-testid="contact-sales">
            <Link href="/contact">
              Contact Sales
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Ad Formats */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Available Ad Formats
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Professional ad formats optimized for crypto audiences
            </p>
          </div>
        
          <div className="space-y-12">
            {adFormats.map((format, index) => (
              <Card key={index} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <format.icon className="h-12 w-12 text-teal-400 mr-4" />
                    <div>
                      <CardTitle className="text-slate-900 dark:text-white text-2xl">{format.name}</CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-300 text-lg">
                        {format.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-3 gap-8">
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Available Sizes & CPM</h4>
                      <div className="space-y-2">
                        {format.sizes.map((size, i) => (
                          <div key={i} className="flex justify-between items-center bg-slate-100 dark:bg-slate-700/50 rounded-lg p-3">
                            <div>
                              <div className="text-slate-900 dark:text-white font-medium">{size.size}</div>
                              <div className="text-slate-500 dark:text-slate-400 text-sm">{size.name}</div>
                            </div>
                            <Badge variant="secondary" className="bg-teal-600/20 text-teal-300">
                              {size.cpm}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Features</h4>
                      <div className="space-y-2">
                        {format.features.map((feature, i) => (
                          <div key={i} className="flex items-center text-slate-600 dark:text-slate-300">
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Best For</h4>
                      <p className="text-slate-600 dark:text-slate-300">{format.bestFor}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Device Support */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Multi-Device Support
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            All formats optimized for every device and screen size
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {devices.map((device, index) => (
            <Card key={index} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 text-center">
              <CardHeader>
                <device.icon className="h-16 w-16 text-teal-400 mx-auto mb-4" />
                <CardTitle className="text-slate-900 dark:text-white">{device.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  {device.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Targeting Options */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Advanced Targeting Options
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Reach your exact audience with precision targeting
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {targetingOptions.map((option, index) => (
              <Card key={index} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center">
                    <Target className="h-5 w-5 text-teal-400 mr-2" />
                    {option.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    {option.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="bg-gradient-to-r from-[#02C8B9] to-[#0194D9] rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Launch Your Campaign?
          </h2>
          <p className="text-xl text-white mb-8">
            Choose your ad format and start reaching crypto audiences today
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild size="lg" variant="secondary" data-testid="get-started-bottom">
              <Link href="/auth/signup?role=advertiser">
                Get Started
              </Link>
            </Button>
            <Button asChild size="lg" data-testid="contact-sales-bottom">
              <Link href="/contact">
                Contact Sales
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">CoinAds</h3>
              <p className="text-slate-600 dark:text-slate-300">
                The leading self-serve advertising platform for crypto companies.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li><Link href="/advertisers">For Advertisers</Link></li>
                <li><Link href="/publishers">For Publishers</Link></li>
                <li><Link href="/ad-formats">Ad Formats</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/legal/privacy">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li><Link href="/legal/advertiser-terms">Advertiser Terms</Link></li>
                <li><Link href="/legal/publisher-terms">Publisher Terms</Link></li>
                <li><Link href="/legal/cookies">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-slate-500 dark:text-slate-400">
            <p>&copy; 2024 CoinAds. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
