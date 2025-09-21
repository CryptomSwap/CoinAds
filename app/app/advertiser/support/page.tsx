"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Phone, Mail, Clock, CheckCircle } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support</h1>
        <p className="text-muted-foreground">
          Get help with your campaigns and account
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
            <Button className="w-full justify-start">
              <MessageCircle className="h-4 w-4 mr-2" />
              Live Chat
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Mail className="h-4 w-4 mr-2" />
              Email Support
            </Button>
            <Button variant="outline" className="w-full justify-start">
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
              <Input placeholder="Brief description of your issue" />
            </div>
            <div>
              <label className="text-sm font-medium">Priority</label>
              <select className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              placeholder="Please provide detailed information about your issue..."
              className="min-h-[120px]"
            />
          </div>
          <Button>
            Submit Ticket
          </Button>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Quick answers to common questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">How do I create a new campaign?</h3>
            <p className="text-sm text-muted-foreground">
              Go to the Campaigns page and click "Create Campaign". Fill in your campaign details, set your budget, and upload your creatives.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">How long does campaign approval take?</h3>
            <p className="text-sm text-muted-foreground">
              Most campaigns are reviewed within 24 hours. Complex campaigns may take up to 48 hours.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">How do I add funds to my account?</h3>
            <p className="text-sm text-muted-foreground">
              Go to your Wallet page and click "Add Credits". You can pay with credit card, PayPal, or cryptocurrency.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Can I pause my campaigns?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can pause or resume campaigns at any time from the Campaigns page.
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
                <h3 className="font-medium">Campaign not showing impressions</h3>
                <p className="text-sm text-muted-foreground">Submitted 2 hours ago</p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Resolved</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Payment method not working</h3>
                <p className="text-sm text-muted-foreground">Submitted 1 day ago</p>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-600">In Progress</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
