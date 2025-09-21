"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

export function CookiePreferencesModal({ 
  isOpen, 
  onOpenChange 
}: { 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void; 
}) {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [isSaving, setIsSaving] = useState(false);

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
            onClick={handleRejectNonEssential}
          >
            <Shield className="mr-2 h-4 w-4" />
            Reject Non-Essential
          </Button>
          <Button 
            onClick={handleSavePreferences}
            disabled={isSaving}
            data-testid="btn_save_prefs"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
          <Button 
            onClick={handleAcceptAll}
            data-testid="btn_accept_all"
          >
            <Check className="mr-2 h-4 w-4" />
            Accept All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
