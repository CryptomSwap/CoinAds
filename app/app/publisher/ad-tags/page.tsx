"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Code, 
  Eye, 
  Globe, 
  Smartphone, 
  Monitor,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import RequireAuth from "@/components/RequireAuth";

interface Placement {
  id: string;
  name: string;
  type: string;
  size: string;
  siteId: string;
  status: string;
}

interface Site {
  id: string;
  name: string;
  domain: string;
  status: string;
}

export default function AdTagGeneratorPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedPlacement, setSelectedPlacement] = useState("");
  const [generatedTag, setGeneratedTag] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  useEffect(() => {
    if (selectedSite) {
      fetchPlacements(selectedSite);
    }
  }, [selectedSite]);

  useEffect(() => {
    if (selectedPlacement) {
      generateAdTag();
    }
  }, [selectedPlacement]);

  const fetchSites = async () => {
    try {
      const response = await fetch("/api/publisher/sites");
      const data = await response.json();

      if (response.ok) {
        setSites(data.sites.filter((site: Site) => site.status === "APPROVED"));
      } else {
        setError(data.error || "Failed to fetch sites");
      }
    } catch (error) {
      setError("Error fetching sites");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlacements = async (siteId: string) => {
    try {
      const response = await fetch(`/api/publisher/sites/${siteId}`);
      const data = await response.json();

      if (response.ok) {
        setPlacements(data.site.placements.filter((p: Placement) => p.status === "ACTIVE"));
      } else {
        setError(data.error || "Failed to fetch placements");
      }
    } catch (error) {
      setError("Error fetching placements");
    }
  };

  const generateAdTag = () => {
    if (!selectedPlacement) return;

    const placement = placements.find(p => p.id === selectedPlacement);
    if (!placement) return;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const deliveryUrl = `${baseUrl}/api/delivery?placementId=${placement.id}`;

    const adTag = `<!-- CoinAds Ad Tag - ${placement.name} -->
<div id="coinads-${placement.id}" style="width: ${placement.size.split('x')[0]}px; height: ${placement.size.split('x')[1]}px;">
  <script>
    (function() {
      var script = document.createElement('script');
      script.async = true;
      script.src = '${deliveryUrl}';
      script.onload = function() {
        // Ad loaded successfully
        console.log('CoinAds: Ad loaded for placement ${placement.id}');
      };
      script.onerror = function() {
        // Ad failed to load
        console.log('CoinAds: Ad failed to load for placement ${placement.id}');
        document.getElementById('coinads-${placement.id}').innerHTML = '<!-- Ad space available -->';
      };
      document.getElementById('coinads-${placement.id}').appendChild(script);
    })();
  </script>
</div>
<!-- End CoinAds Ad Tag -->`;

    setGeneratedTag(adTag);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedTag);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const getSizeIcon = (size: string) => {
    const [width, height] = size.split('x').map(Number);
    
    if (width <= 300 && height <= 250) {
      return <Smartphone className="h-4 w-4" />;
    } else if (width <= 728 && height <= 90) {
      return <Monitor className="h-4 w-4" />;
    } else {
      return <Globe className="h-4 w-4" />;
    }
  };

  const getSizeDescription = (size: string) => {
    const [width, height] = size.split('x').map(Number);
    
    if (width === 300 && height === 250) return "Medium Rectangle";
    if (width === 728 && height === 90) return "Leaderboard";
    if (width === 160 && height === 600) return "Wide Skyscraper";
    if (width === 320 && height === 50) return "Mobile Banner";
    if (width === 468 && height === 60) return "Banner";
    
    return `${width}x${height} Custom`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ad Tag Generator</h1>
          <p className="text-muted-foreground">
            Generate ad tags for your approved sites and placements
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Site Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Select Site</span>
          </CardTitle>
          <CardDescription>
            Choose an approved site to generate ad tags
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site">Site</Label>
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <span>{site.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {site.domain}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {sites.length === 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No approved sites found. Please ensure your sites are verified and approved before generating ad tags.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Placement Selection */}
      {selectedSite && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span>Select Placement</span>
            </CardTitle>
            <CardDescription>
              Choose an active placement to generate the ad tag
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="placement">Placement</Label>
                <Select value={selectedPlacement} onValueChange={setSelectedPlacement}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a placement" />
                  </SelectTrigger>
                  <SelectContent>
                    {placements.map((placement) => (
                      <SelectItem key={placement.id} value={placement.id}>
                        <div className="flex items-center space-x-2">
                          {getSizeIcon(placement.size)}
                          <span>{placement.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {placement.size}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {placements.length === 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No active placements found for this site. Create placements first.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Ad Tag */}
      {generatedTag && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Generated Ad Tag</span>
                </CardTitle>
                <CardDescription>
                  Copy this code and paste it into your website's HTML
                </CardDescription>
              </div>
              <Button onClick={copyToClipboard} variant="outline">
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={generatedTag}
                readOnly
                rows={15}
                className="font-mono text-sm"
              />
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Place this code where you want the ad to appear on your website. 
                  The ad will automatically load and display when visitors view your page.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Guide</CardTitle>
          <CardDescription>
            How to integrate CoinAds on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">1</span>
              </div>
              <div>
                <h4 className="font-medium">Copy the Ad Tag</h4>
                <p className="text-sm text-muted-foreground">
                  Use the generated ad tag above and copy it to your clipboard.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">2</span>
              </div>
              <div>
                <h4 className="font-medium">Paste in Your HTML</h4>
                <p className="text-sm text-muted-foreground">
                  Paste the ad tag where you want the ad to appear on your website.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">3</span>
              </div>
              <div>
                <h4 className="font-medium">Test the Integration</h4>
                <p className="text-sm text-muted-foreground">
                  Visit your website to ensure the ad loads correctly and starts earning.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </RequireAuth>
  );
}
