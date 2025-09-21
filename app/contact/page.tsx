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
import { 
  ArrowRight, 
  FileText, 
  Mail, 
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Send
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.subject) {
      newErrors.subject = "Please select a subject";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        subject: "",
        message: ""
      });
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help from our support team",
      contact: "support@coinads.com",
      action: "Send Email"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with us in real-time",
      contact: "Available 24/7",
      action: "Start Chat"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with our team directly",
      contact: "+1 (555) 123-4567",
      action: "Call Now"
    }
  ];

  const offices = [
    {
      city: "San Francisco",
      address: "123 Market Street, Suite 100",
      phone: "+1 (555) 123-4567",
      hours: "Mon-Fri 9AM-6PM PST"
    },
    {
      city: "New York",
      address: "456 Broadway, Floor 15",
      phone: "+1 (555) 987-6543",
      hours: "Mon-Fri 9AM-6PM EST"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="h-16 bg-background border-b border-border">
        <div className="mx-auto max-w-6xl px-6 h-full">
          <div className="flex items-center justify-between h-full">
            <Logo className="text-foreground" />
            <div className="flex items-center space-x-8">
              <Link 
                href="/advertisers" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                For Advertisers
              </Link>
              <Link 
                href="/publishers" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                For Publishers
              </Link>
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

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight mb-6">
          Get in Touch
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Have questions about CoinAds? We're here to help. 
          Reach out to our team for support, partnerships, or general inquiries.
        </p>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              How Can We Help?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Choose the best way to reach us
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <method.icon className="h-12 w-12 text-teal-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">{method.title}</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    {method.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                      {method.contact}
                    </div>
                    <Button className="w-full">
                      {method.action}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white text-center">Send us a Message</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300 text-center">
                Fill out the form below and we'll get back to you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-300">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-slate-900 dark:text-white">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className={`mt-2 ${errors.firstName ? "border-red-500" : ""}`}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <div className="flex items-center mt-1 text-red-400 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.firstName}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-slate-900 dark:text-white">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={`mt-2 ${errors.lastName ? "border-red-500" : ""}`}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <div className="flex items-center mt-1 text-red-400 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.lastName}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-slate-900 dark:text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`mt-2 ${errors.email ? "border-red-500" : ""}`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <div className="flex items-center mt-1 text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="company" className="text-slate-900 dark:text-white">Company (Optional)</Label>
                    <Input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="mt-2"
                      placeholder="Your Company"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject" className="text-slate-900 dark:text-white">Subject</Label>
                    <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                      <SelectTrigger className={`mt-2 ${errors.subject ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="advertiser">Advertiser Support</SelectItem>
                        <SelectItem value="publisher">Publisher Support</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="billing">Billing Question</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.subject && (
                      <div className="flex items-center mt-1 text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.subject}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-slate-900 dark:text-white">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className={`mt-2 ${errors.message ? "border-red-500" : ""}`}
                      placeholder="Tell us how we can help..."
                      rows={5}
                    />
                    {errors.message && (
                      <div className="flex items-center mt-1 text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.message}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Office Locations */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Our Offices
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Visit us at one of our locations
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {offices.map((office, index) => (
            <Card key={index} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-teal-400" />
                  {office.city}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <MapPin className="h-4 w-4 mr-2" />
                  {office.address}
                </div>
                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <Phone className="h-4 w-4 mr-2" />
                  {office.phone}
                </div>
                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <Clock className="h-4 w-4 mr-2" />
                  {office.hours}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">How do I get started as an advertiser?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  Simply sign up for an account, add funds to your wallet, create a campaign, 
                  upload your creatives, and launch. Our platform guides you through each step.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">What are the requirements for publishers?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  Publishers need a crypto or blockchain-focused website with good traffic. 
                  We review all applications to ensure quality and brand safety.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  We accept credit cards, Bitcoin, Ethereum, USDT, USDC, and wire transfers. 
                  Publishers can receive payouts in crypto or traditional methods.
                </p>
              </CardContent>
            </Card>
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
