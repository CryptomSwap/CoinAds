"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft,
  ArrowRight,
  Check,
  AlertTriangle,
  Upload,
  X,
  ExternalLink,
  ChevronRight,
  Wallet,
  Bell
} from "lucide-react";
import RequireAuth from "@/components/RequireAuth";

// Mock data for partner sites and placements
interface Placement {
  id: string;
  name: string;
  size: string;
  mobileSize: string;
  cpmCents: number | null;
  availableFrom: string | null;
  monthlyCapacity: string;
  ctr: string;
}

interface Site {
  id: string;
  domain: string;
  name: string;
  logo: string;
  status: string;
  placements: Placement[];
}

const emptySites: Site[] = [
  {
    id: "1",
    domain: "coinranking.com",
    name: "Coinranking",
    logo: "🪙",
    status: "APPROVED",
    placements: [
      {
        id: "1",
        name: "Sticky Banner",
        size: "728x90",
        mobileSize: "320x50",
        cpmCents: 600, // $6.00
        availableFrom: "2025-10-22",
        monthlyCapacity: "2M",
        ctr: "0.20%"
      },
      {
        id: "2",
        name: "Top Leaderboard",
        size: "728x90",
        mobileSize: "320x50",
        cpmCents: 500, // $5.00
        availableFrom: null,
        monthlyCapacity: "3M",
        ctr: "0.10%"
      },
      {
        id: "3",
        name: "Middle Leaderboard",
        size: "728x90",
        mobileSize: "320x50",
        cpmCents: 500, // $5.00
        availableFrom: null,
        monthlyCapacity: "2M",
        ctr: "0.10%"
      },
      {
        id: "4",
        name: "Side Banner",
        size: "300x250",
        mobileSize: "300x250",
        cpmCents: 500, // $5.00
        availableFrom: null,
        monthlyCapacity: "1M",
        ctr: "0.15%"
      }
    ]
  },
  {
    id: "2",
    domain: "cryptodaily.co.uk",
    name: "CryptoDaily",
    logo: "📰",
    status: "APPROVED",
    placements: [
      {
        id: "5",
        name: "Top Fixed Banner",
        size: "1920x82",
        mobileSize: "320x50",
        cpmCents: null, // TBD pricing
        availableFrom: null,
        monthlyCapacity: "TBD",
        ctr: "TBD"
      },
      {
        id: "6",
        name: "Bottom Fixed Banner",
        size: "1920x82",
        mobileSize: "320x50",
        cpmCents: null, // TBD pricing
        availableFrom: null,
        monthlyCapacity: "TBD",
        ctr: "TBD"
      },
      {
        id: "7",
        name: "Leadership Banner",
        size: "728x90",
        mobileSize: "728x90",
        cpmCents: null, // TBD pricing
        availableFrom: null,
        monthlyCapacity: "TBD",
        ctr: "TBD"
      },
      {
        id: "8",
        name: "Sidebar Banner",
        size: "300x250",
        mobileSize: "300x250",
        cpmCents: null, // TBD pricing
        availableFrom: null,
        monthlyCapacity: "TBD",
        ctr: "TBD"
      }
    ]
  }
];

const steps = [
  { id: 1, title: "Details", description: "Campaign name and budget" },
  { id: 2, title: "Targeting", description: "Countries and devices" },
  { id: 3, title: "Site & Placement", description: "Choose where to show ads" },
  { id: 4, title: "Creatives", description: "Upload ad creatives" },
  { id: 5, title: "Review", description: "Review and activate" }
];

// Design tokens - now using CSS variables for theme compatibility
const DESIGN_TOKENS = {
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
  },
};

export default function NewCampaignPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    totalBudget: "",
    startDate: "",
    endDate: "",
    countries: [] as string[],
    devices: [] as string[],
    selectedPlacements: [] as string[],
    creatives: [] as any[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [showLowBalanceBanner, setShowLowBalanceBanner] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Mock balance - in real app this would come from context/API
  const currentBalance = 1500.00;
  const isLowBalance = currentBalance < 100;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          newErrors.name = "This field is required.";
        } else if (formData.name.trim().length < 3) {
          newErrors.name = "Enter a valid campaign name.";
        }
        if (!formData.totalBudget || parseFloat(formData.totalBudget) < 50) {
          newErrors.totalBudget = "Enter an amount of at least $50.";
        }
        break;
      case 2:
        if (formData.countries.length === 0) newErrors.countries = "This field is required.";
        if (formData.devices.length === 0) newErrors.devices = "This field is required.";
        break;
      case 3:
        if (formData.selectedPlacements.length === 0) {
          newErrors.placements = "This field is required.";
        }
        break;
      case 4:
        if (formData.creatives.length === 0) {
          newErrors.creatives = "This field is required.";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = async () => {
    if (validateStep(currentStep)) {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 160));
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
      setIsTransitioning(false);
    }
  };

  const prevStep = async () => {
    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 160));
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setIsTransitioning(false);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    try {
      // Check if any selected placement has TBD pricing
      const hasTbdPricing = formData.selectedPlacements.some(placementId => {
        const placement = emptySites.flatMap(site => site.placements).find((p: Placement) => p.id === placementId);
        return placement?.cpmCents === null;
      });

      // Create campaign
      const response = await fetch('/api/advertiser/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          budget: formData.totalBudget,
          startDate: formData.startDate,
          endDate: formData.endDate,
          countries: formData.countries,
          devices: formData.devices,
          selectedPlacements: formData.selectedPlacements,
          creatives: formData.creatives,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create campaign');
      }

      const result = await response.json();
      
      if (hasTbdPricing) {
        // Submit for review
        console.log("Campaign created and submitted for review due to TBD pricing");
        router.push("/app/advertiser/campaigns/new/review");
      } else {
        // Activate campaign
        console.log("Campaign created and activated");
        router.push("/app/advertiser/campaigns");
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      // TODO: Show error toast
      alert(`Failed to create campaign: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getSelectedPlacements = () => {
    return emptySites.flatMap(site => site.placements)
      .filter((placement: Placement) => formData.selectedPlacements.includes(placement.id));
  };

  const getRequiredSizes = () => {
    const selectedPlacements = getSelectedPlacements();
    const sizes = new Set<string>();
    selectedPlacements.forEach((placement: Placement) => {
      sizes.add(placement.size);
      if (placement.mobileSize && placement.mobileSize !== placement.size) {
        sizes.add(placement.mobileSize);
      }
    });
    return Array.from(sizes);
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Only image files are allowed';
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return 'File size must be less than 5MB';
    }
    
    return null;
  };

  const getImageDimensions = (file: File): Promise<{width: number, height: number}> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    const newCreatives = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validationError = validateFile(file);
      
      if (validationError) {
        alert(validationError);
        continue;
      }

      try {
        const dimensions = await getImageDimensions(file);
        const creative = {
          id: Date.now() + i,
          name: file.name,
          size: `${dimensions.width}x${dimensions.height}`,
          file: file,
          preview: URL.createObjectURL(file),
          status: 'pending'
        };
        newCreatives.push(creative);
      } catch (error) {
        console.error('Error processing file:', error);
        alert('Error processing file: ' + file.name);
      }
    }

    if (newCreatives.length > 0) {
      updateFormData('creatives', [...formData.creatives, ...newCreatives]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  const removeCreative = (creativeId: number) => {
    const updatedCreatives = formData.creatives.filter(creative => creative.id !== creativeId);
    updateFormData('creatives', updatedCreatives);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const renderStepper = () => (
    <div className="flex items-center justify-center py-6">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium transition-all duration-200 ${
                  currentStep === step.id
                    ? 'bg-gradient-brand text-white shadow-md'
                    : currentStep > step.id
                    ? 'bg-card border-2 border-transparent bg-gradient-brand bg-clip-border text-transparent bg-clip-text'
                    : 'bg-card border-2 border-border text-muted-foreground'
                }`}
                aria-current={currentStep === step.id ? "step" : undefined}
              >
                {currentStep > step.id ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  step.id
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-px mx-4 ${
                currentStep > step.id ? 'bg-gradient-brand' : 'bg-border'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStickyFooter = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
      {/* Progress Summary */}
      <div className="px-6 py-3 bg-muted border-b border-border">
        <p className="text-sm text-muted-foreground text-center">
          Step {currentStep} of {steps.length} · {steps[currentStep - 1]?.title}
        </p>
      </div>
      
      {/* Navigation */}
      <div className="px-6 py-4 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="text-muted-foreground border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="text-muted-foreground border-border hover:bg-accent"
            onClick={async () => {
              try {
                // Save draft functionality
                const response = await fetch('/api/advertiser/campaigns', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    ...formData,
                    status: 'DRAFT',
                  }),
                });

                if (!response.ok) {
                  throw new Error('Failed to save draft');
                }

                // TODO: Show success toast
                alert('Draft saved successfully');
              } catch (error) {
                console.error('Error saving draft:', error);
                // TODO: Show error toast
                alert('Failed to save draft');
              }
            }}
          >
            Save Draft
          </Button>
          {currentStep < steps.length ? (
            <Button 
              onClick={nextStep}
              disabled={!validateStep(currentStep)}
            >
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={!validateStep(currentStep)}
            >
              Create Campaign
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={`transition-all duration-160 ease-out ${
            isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}>
            {/* Low Balance Banner */}
            {isLowBalance && showLowBalanceBanner && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Low balance — add credits to keep your campaigns running.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => router.push('/app/advertiser/wallet')}
                  >
                    <Wallet className="h-4 w-4 mr-1" />
                    Add Credits
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLowBalanceBanner(false)}
                    className="text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Campaign Information Card */}
            <div className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
              {/* Section A: Campaign Information */}
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground mb-6">Campaign Information</h3>
                
                <div className="space-y-6">
                  {/* Campaign Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">
                      Campaign Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your campaign name"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      className={`h-11 rounded-xl border-border focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-120 ${
                        errors.name ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''
                      }`}
                      style={{
                        fontSize: '14px',
                        paddingLeft: '14px',
                        paddingRight: '14px',
                      }}
                    />
                    <div className="flex justify-between items-center">
                      {errors.name ? (
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          <p className="text-sm text-destructive">{errors.name}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">This name will help you identify your campaign.</p>
                      )}
                      <span className="text-xs text-muted-foreground">{formData.name.length}/50</span>
                    </div>
                  </div>

                  {/* Total Budget */}
                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-sm font-medium text-foreground">
                      Total Budget *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm font-medium">$</span>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="0.00"
                        className={`h-11 pl-8 rounded-xl border-border focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-120 ${
                          errors.totalBudget ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''
                        }`}
                        style={{
                          fontSize: '14px',
                          paddingLeft: '32px',
                          paddingRight: '14px',
                        }}
                        value={formData.totalBudget}
                        onChange={(e) => updateFormData("totalBudget", e.target.value)}
                      />
                    </div>
                    {errors.totalBudget ? (
                      <div className="flex items-center space-x-1">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <p className="text-sm text-destructive">{errors.totalBudget}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">You can add more credits to your account anytime.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section B: Campaign Schedule */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Campaign Schedule</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Date */}
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-sm font-medium text-foreground">
                      Start Date
                      <span className="text-muted-foreground font-normal ml-1">(Optional)</span>
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      className="h-11 rounded-xl border-border focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-120"
                      style={{
                        fontSize: '14px',
                        paddingLeft: '14px',
                        paddingRight: '14px',
                      }}
                      value={formData.startDate}
                      onChange={(e) => updateFormData("startDate", e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">Leave empty to start immediately.</p>
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-sm font-medium text-foreground">
                      End Date
                      <span className="text-muted-foreground font-normal ml-1">(Optional)</span>
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      className="h-11 rounded-xl border-border focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-120"
                      style={{
                        fontSize: '14px',
                        paddingLeft: '14px',
                        paddingRight: '14px',
                      }}
                      value={formData.endDate}
                      onChange={(e) => updateFormData("endDate", e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">Leave empty for continuous running.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Countries *</Label>
              <div className="grid grid-cols-2 gap-2">
                {["All", "US", "UK", "CA", "AU", "DE", "FR", "JP"].map(country => (
                  <Button
                    key={country}
                    variant={formData.countries.includes(country) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const newCountries = formData.countries.includes(country)
                        ? formData.countries.filter(c => c !== country)
                        : [...formData.countries, country];
                      updateFormData("countries", newCountries);
                    }}
                  >
                    {country}
                  </Button>
                ))}
              </div>
              {errors.countries && <p className="text-sm text-destructive">{errors.countries}</p>}
              <p className="text-sm text-muted-foreground">Keep it broad for faster delivery.</p>
            </div>

            <div className="space-y-2">
              <Label>Devices *</Label>
              <div className="flex gap-2">
                {["Desktop", "Mobile"].map(device => (
                  <Button
                    key={device}
                    variant={formData.devices.includes(device) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const newDevices = formData.devices.includes(device)
                        ? formData.devices.filter(d => d !== device)
                        : [...formData.devices, device];
                      updateFormData("devices", newDevices);
                    }}
                  >
                    {device}
                  </Button>
                ))}
              </div>
              {errors.devices && <p className="text-sm text-destructive">{errors.devices}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sites List */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Available Sites</h3>
                {emptySites.map(site => (
                  <Card key={site.id} className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{site.logo}</span>
                      <div>
                        <h4 className="font-medium text-foreground">{site.name}</h4>
                        <p className="text-sm text-muted-foreground">{site.domain}</p>
                      </div>
                      <Badge className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">Available</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {site.placements.map((placement: Placement) => (
                        <div
                          key={placement.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            formData.selectedPlacements.includes(placement.id)
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => {
                            const newPlacements = formData.selectedPlacements.includes(placement.id)
                              ? formData.selectedPlacements.filter(p => p !== placement.id)
                              : [...formData.selectedPlacements, placement.id];
                            updateFormData("selectedPlacements", newPlacements);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-foreground">{placement.name}</h5>
                              <p className="text-sm text-muted-foreground">
                                {placement.size} / {placement.mobileSize}
                              </p>
                            </div>
                            <div className="text-right">
                              {placement.cpmCents ? (
                                <Badge className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                                  ${(placement.cpmCents / 100).toFixed(2)} CPM
                                </Badge>
                              ) : (
                                <Badge className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
                                  TBD
                                </Badge>
                              )}
                            </div>
                          </div>
                          {placement.availableFrom && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Available from {placement.availableFrom}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Selected Placements Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Selected Placements</h3>
                {formData.selectedPlacements.length === 0 ? (
                  <p className="text-muted-foreground">No placements selected</p>
                ) : (
                  <div className="space-y-2">
                    {getSelectedPlacements().map((placement: Placement) => (
                      <div key={placement.id} className="p-3 border rounded-lg bg-muted">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-foreground">{placement.name}</h5>
                            <p className="text-sm text-muted-foreground">
                              {placement.size} / {placement.mobileSize}
                            </p>
                          </div>
                          {placement.cpmCents ? (
                            <Badge className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                              ${(placement.cpmCents / 100).toFixed(2)} CPM
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
                              TBD
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {formData.selectedPlacements.some(placementId => {
              const placement = emptySites.flatMap(site => site.placements).find((p: Placement) => p.id === placementId);
              return placement?.cpmCents === null;
            }) && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Pricing for some placements is not set yet. Submit for review or choose different placements.
                </AlertDescription>
              </Alert>
            )}

            {errors.placements && <p className="text-sm text-destructive">{errors.placements}</p>}
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            {/* Required Sizes Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <h3 className="text-lg font-semibold text-foreground">Required Creative Sizes</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {getRequiredSizes().map(size => (
                  <div key={size} className="px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg">
                    <span className="text-sm font-medium text-primary">{size}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Upload creatives in these exact dimensions for optimal performance
              </p>
            </div>

            {/* Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <h3 className="text-lg font-semibold text-foreground">Upload Creatives</h3>
              </div>
              
              <div 
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                  isDragOver 
                    ? "border-primary bg-primary/5 scale-[1.02]" 
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className={`p-4 rounded-full transition-colors ${
                    isDragOver ? "bg-primary/10" : "bg-muted"
                  }`}>
                    <Upload className={`h-8 w-8 ${
                      isDragOver ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">
                      {isDragOver ? "Drop your files here" : "Upload Creative Files"}
                    </h4>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Drag and drop your creative files here, or click the button below to browse your computer
                    </p>
                  </div>
                  
                  <Button 
                    className="mt-6 px-8 py-3" 
                    onClick={openFileDialog}
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Choose Files
                  </Button>
                  
                  <p className="text-xs text-muted-foreground">
                    Supported formats: JPG, PNG, GIF • Max size: 5MB per file
                  </p>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Uploaded Creatives Section */}
            {formData.creatives.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">Uploaded Creatives</h3>
                    <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                      {formData.creatives.length} file{formData.creatives.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.creatives.map((creative) => (
                    <div key={creative.id} className="group relative bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {creative.preview ? (
                            <img 
                              src={creative.preview} 
                              alt={creative.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">Preview</span>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground truncate">{creative.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{creative.size}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800 text-xs">
                              Pending Review
                            </Badge>
                          </div>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeCreative(creative.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {errors.creatives && (
              <div className="flex items-center space-x-2 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-destructive">{errors.creatives}</p>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Campaign Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">Campaign Name</Label>
                  <p className="text-sm text-muted-foreground">{formData.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground">Total Budget</Label>
                  <p className="text-sm text-muted-foreground">${formData.totalBudget}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Targeting</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">Countries</Label>
                  <p className="text-sm text-muted-foreground">{formData.countries.join(", ")}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground">Devices</Label>
                  <p className="text-sm text-muted-foreground">{formData.devices.join(", ")}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Sites & Placements</h3>
              <div className="space-y-2">
                {getSelectedPlacements().map((placement: Placement) => (
                  <div key={placement.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h5 className="font-medium text-foreground">{placement.name}</h5>
                      <p className="text-sm text-muted-foreground">
                        {placement.size} / {placement.mobileSize}
                      </p>
                    </div>
                    {placement.cpmCents ? (
                      <Badge className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                        ${(placement.cpmCents / 100).toFixed(2)} CPM
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
                        TBD
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Creatives</h3>
              <div className="space-y-2">
                {formData.creatives.map((creative) => (
                  <div key={creative.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center overflow-hidden">
                      {creative.preview ? (
                        <img 
                          src={creative.preview} 
                          alt={creative.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">Preview</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-foreground">{creative.name}</h5>
                      <p className="text-sm text-muted-foreground">{creative.size}</p>
                    </div>
                    <Badge className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">Pending</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              {formData.selectedPlacements.some(placementId => {
                const placement = emptySites.flatMap(site => site.placements).find((p: Placement) => p.id === placementId);
                return placement?.cpmCents === null;
              }) ? (
                <Button onClick={handleSubmit} className="w-full">
                  Submit for Review
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="w-full">
                  Activate Campaign
                </Button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto px-6 pb-32">
        {/* Header Section */}
        <div className="pt-8 pb-6">
          {/* Breadcrumb */}
          <nav className="mb-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Advertiser</span>
              <ChevronRight className="h-4 w-4" />
              <span>Campaigns</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">New</span>
            </div>
          </nav>

          {/* Page Title Row */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Create New Campaign</h1>
              <p className="text-muted-foreground max-w-2xl">
                Set up your advertising campaign step by step.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.back()} 
              className="text-muted-foreground border-border hover:bg-accent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Campaigns
            </Button>
          </div>
        </div>

        {/* Stepper */}
        <div className="bg-card border border-border rounded-2xl shadow-sm mb-8">
          {renderStepper()}
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}
        </div>
      </div>

      {/* Sticky Footer */}
      {renderStickyFooter()}
      </div>
    </RequireAuth>
  );
}