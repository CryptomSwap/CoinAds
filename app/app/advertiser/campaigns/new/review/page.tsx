"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeader } from "@/components/ui/page-header";
import { Stepper } from "@/components/ui/stepper";
import { ArrowLeft, ArrowRight, Save, AlertTriangle, DollarSign, Globe, Smartphone, Calendar } from "lucide-react";

// Mock data - in real app this would come from campaign wizard state
const mockCampaignData = {
  name: "Bitcoin Exchange Campaign",
  budget: 5000,
  startDate: "2024-01-15",
  endDate: "2024-02-15",
  countries: ["US", "CA", "GB"],
  devices: ["desktop", "mobile"],
  placements: [
    { publisher: "CryptoNews", size: "728x90", cpm: 2.50 },
    { publisher: "CoinDesk", size: "300x250", cpm: 3.20 },
    { publisher: "Decrypt", size: "728x90", cpm: 2.80 },
  ],
  creatives: [
    { name: "Bitcoin Banner", url: "https://example.com/bitcoin-banner.jpg", clickUrl: "https://bitcoin.com" },
    { name: "Exchange Ad", url: "https://example.com/exchange-ad.jpg", clickUrl: "https://exchange.com" },
  ],
};

const steps = [
  { id: "info", title: "Campaign Info", completed: true },
  { id: "targeting", title: "Targeting", completed: true },
  { id: "placements", title: "Placements", completed: true },
  { id: "creatives", title: "Creatives", completed: true },
  { id: "review", title: "Review & Submit", completed: false },
];

// Metadata removed - client component cannot export metadata

export default function CampaignReviewPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage("");
    
    try {
      // TODO: Implement POST /api/advertiser/campaigns/:id/submit
      const response = await fetch("/api/advertiser/campaigns/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockCampaignData),
      });
      
      if (response.ok) {
        router.push("/app/advertiser/campaigns");
      } else {
        setMessage("Failed to submit campaign. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    
    try {
      // TODO: Implement save draft logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage("Campaign saved as draft.");
    } catch (error) {
      setMessage("Failed to save draft. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const calculateEstimatedCost = () => {
    const totalImpressions = mockCampaignData.placements.reduce((sum, placement) => {
      return sum + (mockCampaignData.budget / placement.cpm) * 1000;
    }, 0);
    return totalImpressions;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader 
        title="Review & Submit" 
        description="Review your campaign details before submitting for approval"
      />

      <Stepper steps={steps} currentStep={4} />

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Summary Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Campaign Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Campaign Name</p>
                  <p className="font-medium">{mockCampaignData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Budget</p>
                  <p className="font-medium">${mockCampaignData.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Start Date</p>
                  <p className="font-medium">{mockCampaignData.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">End Date</p>
                  <p className="font-medium">{mockCampaignData.endDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Targeting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Targeting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-slate-600 mb-2">Countries</p>
                <div className="flex flex-wrap gap-2">
                  {mockCampaignData.countries.map((country) => (
                    <Badge key={country} variant="secondary">{country}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">Devices</p>
                <div className="flex flex-wrap gap-2">
                  {mockCampaignData.devices.map((device) => (
                    <Badge key={device} variant="secondary">
                      {device === "desktop" ? <Globe className="mr-1 h-3 w-3" /> : <Smartphone className="mr-1 h-3 w-3" />}
                      {device}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Placements */}
          <Card>
            <CardHeader>
              <CardTitle>Placements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockCampaignData.placements.map((placement, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-medium">{placement.publisher}</p>
                      <p className="text-sm text-slate-600">{placement.size}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${placement.cpm}</p>
                      <p className="text-sm text-slate-600">CPM</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Creatives */}
          <Card>
            <CardHeader>
              <CardTitle>Creatives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockCampaignData.creatives.map((creative, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg">
                    <div className="w-16 h-12 bg-slate-100 rounded flex items-center justify-center">
                      <span className="text-xs text-slate-500">Preview</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{creative.name}</p>
                      <p className="text-sm text-slate-600 truncate">{creative.clickUrl}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Cost Estimate & Warnings */}
        <div className="space-y-6">
          {/* Cost Estimate */}
          <Card data-testid="card_cost_estimate">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Cost Estimate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  ~{calculateEstimatedCost().toLocaleString()} impressions
                </p>
                <p className="text-sm text-slate-600">Estimated reach</p>
              </div>
              <div className="text-xs text-slate-500 space-y-1">
                <p>• Estimates based on current CPM rates</p>
                <p>• Actual performance may vary</p>
                <p>• Budget will be spent over campaign duration</p>
              </div>
            </CardContent>
          </Card>

          {/* Warnings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-600">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <p>Low budget may limit reach</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p>All required fields completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-background border-t border-slate-200 p-4 -mx-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              data-testid="btn_submit_for_approval"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  Submit for Approval
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
