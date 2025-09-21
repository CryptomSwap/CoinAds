"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Eye, Edit, Trash2, Copy } from "lucide-react";

export default function PlacementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ad Placements</h1>
          <p className="text-muted-foreground">
            Manage your ad placements and zones
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Placement
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Header Banner
              <Badge variant="secondary">Active</Badge>
            </CardTitle>
            <CardDescription>
              Top of page banner placement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-[728/90] bg-gray-100 rounded-md flex items-center justify-center">
              <span className="text-gray-500">728x90</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Impressions:</span>
                <span className="font-medium">1,234,567</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Revenue:</span>
                <span className="font-medium">$456.78</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>eCPM:</span>
                <span className="font-medium">$0.37</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Sidebar Ad
              <Badge variant="secondary">Active</Badge>
            </CardTitle>
            <CardDescription>
              Right sidebar placement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-[300/250] bg-gray-100 rounded-md flex items-center justify-center">
              <span className="text-gray-500">300x250</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Impressions:</span>
                <span className="font-medium">987,654</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Revenue:</span>
                <span className="font-medium">$234.56</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>eCPM:</span>
                <span className="font-medium">$0.24</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              In-Content Ad
              <Badge variant="outline">Paused</Badge>
            </CardTitle>
            <CardDescription>
              Between content blocks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-[728/90] bg-gray-100 rounded-md flex items-center justify-center">
              <span className="text-gray-500">728x90</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Impressions:</span>
                <span className="font-medium">456,789</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Revenue:</span>
                <span className="font-medium">$123.45</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>eCPM:</span>
                <span className="font-medium">$0.27</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create New Placement */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Placement</CardTitle>
          <CardDescription>
            Add a new ad placement to your site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Placement Name</label>
              <input 
                type="text" 
                placeholder="e.g., Header Banner"
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Ad Size</label>
              <select className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md">
                <option>728x90 (Leaderboard)</option>
                <option>300x250 (Medium Rectangle)</option>
                <option>300x600 (Half Page)</option>
                <option>160x600 (Wide Skyscraper)</option>
                <option>320x50 (Mobile Banner)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea 
              placeholder="Describe where this placement will appear..."
              className="w-full h-20 px-3 py-2 border border-input bg-background rounded-md"
            />
          </div>
          <Button>
            Create Placement
          </Button>
        </CardContent>
      </Card>

      {/* Placement Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Placement Settings</CardTitle>
          <CardDescription>
            Configure global placement settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Auto-refresh ads</h3>
              <p className="text-sm text-muted-foreground">Automatically refresh ads every 30 seconds</p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Lazy loading</h3>
              <p className="text-sm text-muted-foreground">Load ads only when they come into view</p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Ad blocker detection</h3>
              <p className="text-sm text-muted-foreground">Show alternative content when ads are blocked</p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
