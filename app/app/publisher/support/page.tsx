"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Phone, Mail, Clock, CheckCircle, HelpCircle, Loader2 } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import { useToast } from "@/lib/toast";
import { hasChatConfig } from "@/lib/env/server";

export default function SupportPage() {
  const { success, error: showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Urgent',
    description: '',
  });

  const handleSubmitTicket = async () => {
    if (!formData.subject || !formData.description) {
      showError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit ticket');
      }

      success('Support ticket submitted successfully! We\'ll get back to you soon.');
      setFormData({
        subject: '',
        priority: 'Medium',
        description: '',
      });
    } catch (error) {
      console.error('Error submitting ticket:', error);
      showError(error instanceof Error ? error.message : 'Failed to submit ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RequireAuth>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support</h1>
        <p className="text-muted-foreground">
          Get help with your publisher account and ad placements
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              Choose your preferred way to get in touch
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasChatConfig ? (
              <Button 
                className="w-full justify-start"
                onClick={() => {
                  // Open chat widget or redirect to chat service
                  if (typeof window !== 'undefined' && (window as any).Intercom) {
                    (window as any).Intercom('show');
                  } else {
                    window.open('mailto:support@coinads.io?subject=Live Chat Request', '_blank');
                  }
                }}
                data-testid="live-chat"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Live Chat
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open('mailto:support@coinads.io?subject=Support Request', '_blank')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </Button>
            )}
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.open('mailto:support@coinads.io?subject=Support Request', '_blank')}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Support
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.open('tel:+1-555-0123', '_blank')}
            >
              <Phone className="h-4 w-4 mr-2" />
              Phone Support
            </Button>
          </CardContent>
        </Card>

        {/* Support Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Support Hours</CardTitle>
            <CardDescription>
              When our team is available to help
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Live Chat</p>
                <p className="text-sm text-muted-foreground">24/7 Available</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-muted-foreground">Mon-Fri, 9AM-6PM EST</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Phone Support</p>
                <p className="text-sm text-muted-foreground">Mon-Fri, 9AM-6PM EST</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Ticket */}
      <Card>
        <CardHeader>
          <CardTitle>Submit a Support Ticket</CardTitle>
          <CardDescription>
            Describe your issue and we'll get back to you quickly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input 
                placeholder="Brief description of your issue"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Priority</label>
              <select 
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              placeholder="Please provide detailed information about your issue..."
              className="min-h-[120px]"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <Button 
            onClick={handleSubmitTicket}
            disabled={isSubmitting || !formData.subject || !formData.description}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Ticket'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Quick answers to common publisher questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">How do I add my site to the platform?</h3>
            <p className="text-sm text-muted-foreground">
              Go to the Sites page and click "Add Site". Enter your site details and we'll review it within 24 hours.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">How do I create ad placements?</h3>
            <p className="text-sm text-muted-foreground">
              Go to the Placements page and click "Create Placement". Choose your ad size and placement location.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">When do I get paid?</h3>
            <p className="text-sm text-muted-foreground">
              Payments are processed monthly on the 15th for earnings from the previous month. Minimum payout is $50.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">How do I get my ad tags?</h3>
            <p className="text-sm text-muted-foreground">
              Go to the Ad Tags page to generate and copy your ad tags for each placement.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">What ad formats are supported?</h3>
            <p className="text-sm text-muted-foreground">
              We support display banners, video ads, native ads, and mobile-optimized formats.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Support Tickets</CardTitle>
          <CardDescription>
            Your recent support requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Site approval status</h3>
                <p className="text-sm text-muted-foreground">Submitted 1 day ago</p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Resolved</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Payment delay inquiry</h3>
                <p className="text-sm text-muted-foreground">Submitted 3 days ago</p>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-600">In Progress</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Ad tag implementation help</h3>
                <p className="text-sm text-muted-foreground">Submitted 1 week ago</p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Resolved</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Helpful Resources</CardTitle>
          <CardDescription>
            Additional resources to help you succeed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => window.open('/docs/publisher-integration', '_blank')}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">Publisher Guide</div>
                <div className="text-sm text-muted-foreground">Complete guide to getting started</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => window.open('/docs/publisher-integration', '_blank')}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">Ad Tag Documentation</div>
                <div className="text-sm text-muted-foreground">Technical implementation guide</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => window.open('/docs/publisher-integration', '_blank')}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">Best Practices</div>
                <div className="text-sm text-muted-foreground">Optimize your ad revenue</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => window.open('/docs/publisher-integration', '_blank')}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">API Documentation</div>
                <div className="text-sm text-muted-foreground">Integrate with our API</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </RequireAuth>
  );
}
