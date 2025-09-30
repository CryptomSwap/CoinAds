"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/components/ui/logo";
import { useState } from "react";
import { signUpUrl, signInUrl } from "@/lib/url";
import { 
  ArrowRight, 
  BarChart3, 
  DollarSign, 
  Globe, 
  Shield, 
  Target,
  Users,
  Zap,
  CheckCircle,
  Star,
  TrendingUp,
  Clock,
  Mail,
  Phone
} from "lucide-react";

export default function AdvertisersPage() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your interest! We'll contact you within 24 hours.");
    setContactForm({ name: "", email: "", company: "", message: "" });
  };
  const features = [
    {
      icon: Target,
      title: "Precise Targeting",
      description: "Target crypto audiences by geography, device, and site category with advanced filtering options."
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track campaign performance with detailed reporting, automated screenshots, and fraud detection."
    },
    {
      icon: DollarSign,
      title: "Flexible Payments",
      description: "Pay with credit cards, crypto, or wire transfers. Auto-recharge options available."
    },
    {
      icon: Shield,
      title: "Brand Safety",
      description: "Advanced fraud protection and brand safety measures to protect your ad spend."
    },
    {
      icon: Zap,
      title: "Quick Launch",
      description: "Create and launch campaigns in minutes with our self-serve platform."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Access premium crypto publishers worldwide with transparent reporting."
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Sign Up",
      description: "Create your advertiser account and verify your identity"
    },
    {
      number: 2,
      title: "Choose Placements",
      description: "Select from premium crypto sites and ad placements"
    },
    {
      number: 3,
      title: "Upload Creatives",
      description: "Upload your banner ads, native content, or HTML5 creatives"
    },
    {
      number: 4,
      title: "Launch Campaign",
      description: "Set your budget, targeting, and launch your campaign"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      company: "DeFi Protocol",
      content: "CoinAds helped us reach our target audience with 40% better CTR than other platforms.",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      company: "Crypto Exchange",
      content: "The real-time reporting and fraud protection give us confidence in our ad spend.",
      rating: 5
    },
    {
      name: "Alex Kim",
      company: "NFT Marketplace",
      content: "Easy to use platform with great support. Our campaigns launched in minutes.",
      rating: 5
    }
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
                className="text-foreground hover:text-muted-foreground transition-colors"
              >
                For Advertisers
              </Link>
              <Link 
                href="/publishers" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                For Publishers
              </Link>
              <Link href={signUpUrl("advertiser")}>
                <Button>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight mb-6">
          Reach Crypto Audiences at Scale
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Launch targeted campaigns on premium crypto and blockchain websites.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href={signUpUrl("advertiser")}>
            <Button size="lg">
              Start Advertising
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline">
              Contact Sales
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why Advertisers Choose CoinAds
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Advanced targeting and fraud protection for crypto companies
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-teal-500/20 rounded-full">
                      <feature.icon className="h-6 w-6 text-teal-400" strokeWidth={1.5} />
                    </div>
                  </div>
                  <CardTitle className="text-slate-900 dark:text-white text-lg">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 dark:text-slate-300 text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Get started in 4 simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-gradient-brand w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-slate-600 dark:text-slate-300">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              What Our Advertisers Say
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Get Started Today
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Ready to launch your crypto advertising campaign? Contact our team for a personalized consultation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Contact Our Team</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Get personalized help with your advertising strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-900 dark:text-white">Name</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-slate-900 dark:text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company" className="text-slate-900 dark:text-white">Company</Label>
                    <Input
                      id="company"
                      value={contactForm.company}
                      onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-slate-900 dark:text-white">Message</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      placeholder="Tell us about your advertising goals..."
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Mail className="h-6 w-6 text-teal-400 mr-3" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Email Support</div>
                      <div className="text-slate-600 dark:text-slate-300">support@coinads.com</div>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    <Phone className="h-6 w-6 text-teal-400 mr-3" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Phone Support</div>
                      <div className="text-slate-600 dark:text-slate-300">+1 (555) 123-4567</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-6 w-6 text-teal-400 mr-3" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Response Time</div>
                      <div className="text-slate-600 dark:text-slate-300">Within 24 hours</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-[#02C8B9]/20 to-[#0194D9]/20 border-teal-500/30">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Start</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-slate-600 dark:text-slate-300">No setup fees</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-slate-600 dark:text-slate-300">Minimum $100 deposit</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-slate-600 dark:text-slate-300">Launch campaigns in minutes</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-slate-600 dark:text-slate-300">24/7 campaign monitoring</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
            Join hundreds of crypto companies already advertising on CoinAds
          </p>
          <div className="flex justify-center space-x-4">
            <Link href={signUpUrl("advertiser")}>
              <Button size="lg" variant="secondary">
                Get Started Free
              </Button>
            </Link>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-gray-900"
              data-testid="schedule-demo"
            >
              <Link href="/contact?subject=Schedule%20Demo">
                Schedule Demo
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
