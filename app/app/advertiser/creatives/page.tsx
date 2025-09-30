import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Upload, Eye, Download, Trash2 } from "lucide-react";

export default function CreativesPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/app/advertiser" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span>Creative Assets</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Creative Assets</h1>
            <p className="text-muted-foreground mt-2">
              Manage your advertising creatives and assets
            </p>
          </div>
          <Button 
            size="lg" 
            data-testid="upload-creative"
            onClick={() => {
              // TODO: Implement creative upload logic
              console.log('Opening creative upload dialog...');
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Creative
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Creative Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No creatives uploaded yet</h3>
                <p className="text-sm mb-4">
                  Upload your first creative asset to get started with advertising
                </p>
                <Button 
                  data-testid="upload-first-creative"
                  onClick={() => {
                    // TODO: Implement creative upload logic
                    console.log('Opening creative upload dialog...');
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Your First Creative
                </Button>
              </div>

              <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg mt-6">
                <h4 className="font-medium mb-2">TODO: Creative Management Features</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Drag & drop file upload interface</li>
                  <li>• Creative preview and editing tools</li>
                  <li>• Format validation (dimensions, file size)</li>
                  <li>• Performance analytics per creative</li>
                  <li>• A/B testing capabilities</li>
                  <li>• Creative approval status tracking</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Supported Formats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Badge variant="outline">Display Banners</Badge>
                <div className="text-xs text-muted-foreground">
                  728x90, 300x250, 320x50
                </div>
              </div>
              <div className="space-y-2">
                <Badge variant="outline">Native Ads</Badge>
                <div className="text-xs text-muted-foreground">
                  1200x630, 1200x1200
                </div>
              </div>
              <div className="space-y-2">
                <Badge variant="outline">Video Ads</Badge>
                <div className="text-xs text-muted-foreground">
                  MP4, max 30s, 16:9 ratio
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/app/advertiser/campaigns/new">
                  Create Campaign
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/docs/ad-formats">
                  View Format Guide
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-8">
        <Button asChild variant="outline">
          <Link href="/app/advertiser">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}