"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Cookie, Shield, BarChart3, Target, Save, Check } from "lucide-react";

interface CookiePreferences {
  strictlyNecessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const defaultPreferences: CookiePreferences = {
  strictlyNecessary: true, // Always true, cannot be disabled
  analytics: false,
  marketing: false,
};

// Metadata removed - client component cannot export metadata

export default function CookiePreferencesPage() {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Load saved preferences from localStorage
    const saved = localStorage.getItem("coinads-cookie-preferences");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch (error) {
        console.error("Failed to parse saved preferences:", error);
      }
    }
  }, []);

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === "strictlyNecessary") return; // Cannot be disabled
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    setMessage("");
    
    try {
      // Save to localStorage (MVP approach)
      localStorage.setItem("coinads-cookie-preferences", JSON.stringify(preferences));
      
      // TODO: Implement POST /api/consent for server-side storage
      const response = await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });
      
      setMessage("Your cookie preferences have been saved successfully!");
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      setMessage("Failed to save preferences. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      strictlyNecessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    handleSavePreferences();
  };

  const handleRejectNonEssential = () => {
    const essentialOnly = {
      strictlyNecessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(essentialOnly);
    handleSavePreferences();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader 
        title="Cookie Preferences" 
        description="Manage your cookie preferences and privacy settings"
      />

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Strictly Necessary Cookies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-green-600" />
              Strictly Necessary Cookies
            </CardTitle>
            <CardDescription>
              These cookies are essential for the website to function properly and cannot be disabled.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="strictly-necessary" className="text-base font-medium">
                  Always Active
                </Label>
                <p className="text-sm text-slate-600">
                  Session management, security, and basic functionality
                </p>
              </div>
              <Switch
                id="strictly-necessary"
                checked={preferences.strictlyNecessary}
                disabled={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Analytics Cookies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
              Analytics Cookies
            </CardTitle>
            <CardDescription>
              These cookies help us understand how visitors interact with our website.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="analytics" className="text-base font-medium">
                  Analytics & Performance
                </Label>
                <p className="text-sm text-slate-600">
                  Google Analytics, performance monitoring, and usage statistics
                </p>
              </div>
              <Switch
                id="analytics"
                checked={preferences.analytics}
                onCheckedChange={(checked) => handlePreferenceChange("analytics", checked)}
                data-testid="btn_analytics_toggle"
              />
            </div>
          </CardContent>
        </Card>

        {/* Marketing Cookies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-purple-600" />
              Marketing Cookies
            </CardTitle>
            <CardDescription>
              These cookies are used to deliver personalized advertisements and track campaign performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="marketing" className="text-base font-medium">
                  Advertising & Marketing
                </Label>
                <p className="text-sm text-slate-600">
                  Ad targeting, conversion tracking, and personalized content
                </p>
              </div>
              <Switch
                id="marketing"
                checked={preferences.marketing}
                onCheckedChange={(checked) => handlePreferenceChange("marketing", checked)}
                data-testid="btn_marketing_toggle"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleSavePreferences}
              disabled={isSaving}
              className="flex-1"
              data-testid="btn_save_prefs"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Preferences"}
            </Button>
            
            <Button 
              onClick={handleAcceptAll}
              variant="outline"
              className="flex-1"
              data-testid="btn_accept_all"
            >
              <Check className="mr-2 h-4 w-4" />
              Accept All
            </Button>
            
            <Button 
              onClick={handleRejectNonEssential}
              variant="outline"
              className="flex-1"
            >
              <Shield className="mr-2 h-4 w-4" />
              Reject Non-Essential
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>More Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-slate-600 space-y-2">
            <p>
              <strong>Cookie Policy:</strong> For detailed information about how we use cookies, 
              please read our{" "}
              <a href="/legal/cookies" className="text-primary hover:underline">
                Cookie Policy
              </a>.
            </p>
            <p>
              <strong>Privacy Policy:</strong> Learn more about how we collect, use, and protect 
              your personal information in our{" "}
              <a href="/legal/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>.
            </p>
            <p>
              <strong>Contact:</strong> If you have questions about our cookie practices, 
              please{" "}
              <a href="/contact" className="text-primary hover:underline">
                contact us
              </a>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Reusable Modal Component
function CookiePreferencesModal({ 
  isOpen, 
  onOpenChange 
}: { 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void; 
}) {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePreferences = async () => {
    setIsSaving(true);
    
    try {
      localStorage.setItem("coinads-cookie-preferences", JSON.stringify(preferences));
      
      // TODO: Implement POST /api/consent
      await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save preferences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      strictlyNecessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    handleSavePreferences();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Cookie className="mr-2 h-5 w-5" />
            Cookie Preferences
          </DialogTitle>
          <DialogDescription>
            We use cookies to enhance your experience and analyze our traffic. 
            You can customize your preferences below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Strictly Necessary */}
          <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
            <div>
              <Label className="font-medium">Strictly Necessary</Label>
              <p className="text-sm text-slate-600">Essential for website functionality</p>
            </div>
            <Switch checked={true} disabled={true} />
          </div>

          {/* Analytics */}
          <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
            <div>
              <Label className="font-medium">Analytics</Label>
              <p className="text-sm text-slate-600">Help us improve our website</p>
            </div>
            <Switch
              checked={preferences.analytics}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, analytics: checked }))}
            />
          </div>

          {/* Marketing */}
          <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
            <div>
              <Label className="font-medium">Marketing</Label>
              <p className="text-sm text-slate-600">Personalized ads and content</p>
            </div>
            <Switch
              checked={preferences.marketing}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, marketing: checked }))}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSavePreferences}
            disabled={isSaving}
            data-testid="btn_save_prefs"
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
          <Button 
            onClick={handleAcceptAll}
            data-testid="btn_accept_all"
          >
            Accept All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
