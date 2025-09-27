'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Calendar, TrendingUp, Eye, MousePointer, DollarSign, AlertCircle } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";

// Types for our data
interface PublisherReportKPIs {
  impressions: number;
  clicks: number;
  ctr: number;
  earnings: number;
}

interface PublisherReportData {
  kpis: PublisherReportKPIs;
  dailyData: Array<{
    date: string;
    impressions: number;
    clicks: number;
    earnings: number;
  }>;
  siteData: Array<{
    id: number;
    domain: string;
    impressions: number;
    clicks: number;
    earnings: number;
    ctr: number;
  }>;
  placementData: Array<{
    id: number;
    size: string;
    impressions: number;
    clicks: number;
    earnings: number;
    ctr: number;
  }>;
}

// Mock data function for client component
function getMockPublisherReportsData(dateRange: string = '7d'): PublisherReportData {
  // Return mock data for client component
  return {
    kpis: {
      impressions: 125000,
      clicks: 3200,
      ctr: 2.56,
      earnings: 875.50,
    },
    dailyData: [
      { date: "2024-01-15", impressions: 15000, clicks: 380, earnings: 105.25 },
      { date: "2024-01-14", impressions: 18000, clicks: 460, earnings: 127.50 },
      { date: "2024-01-13", impressions: 12000, clicks: 310, earnings: 85.75 },
      { date: "2024-01-12", impressions: 16000, clicks: 410, earnings: 113.25 },
      { date: "2024-01-11", impressions: 14000, clicks: 360, earnings: 99.50 },
      { date: "2024-01-10", impressions: 17000, clicks: 435, earnings: 120.25 },
      { date: "2024-01-09", impressions: 13000, clicks: 335, earnings: 92.75 },
    ],
    siteData: [
      { id: 1, domain: "cryptonews.com", impressions: 45000, clicks: 1150, earnings: 318.25, ctr: 2.56 },
      { id: 2, domain: "defi-insights.com", impressions: 38000, clicks: 970, earnings: 268.50, ctr: 2.55 },
      { id: 3, domain: "nft-trends.com", impressions: 42000, clicks: 1080, earnings: 298.75, ctr: 2.57 },
    ],
    placementData: [
      { id: 1, size: "Header Banner", impressions: 25000, clicks: 640, earnings: 177.00, ctr: 2.56 },
      { id: 2, size: "Sidebar", impressions: 20000, clicks: 510, earnings: 141.25, ctr: 2.55 },
      { id: 3, size: "Footer", impressions: 15000, clicks: 385, earnings: 106.50, ctr: 2.57 },
      { id: 4, size: "In-Content", impressions: 30000, clicks: 770, earnings: 213.00, ctr: 2.57 },
      { id: 5, size: "Mobile Banner", impressions: 35000, clicks: 895, earnings: 247.75, ctr: 2.56 },
    ],
  };
}

// Loading Skeleton Component
function PublisherLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("7d");
  const [selectedSite, setSelectedSite] = useState("all");
  const [selectedPlacement, setSelectedPlacement] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get mock data for client component
  const reportData: PublisherReportData = getMockPublisherReportsData(dateRange);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <RequireAuth>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Analyze your site performance and earnings
            </p>
          </div>
        <div className="flex space-x-2">
          <Button variant="outline" disabled>
            <Calendar className="h-4 w-4 mr-2" />
            {dateRange === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
          </Button>
          <Button disabled>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(reportData.kpis.impressions)}</div>
            <p className="text-xs text-muted-foreground">
              {dateRange === '7d' ? 'Last 7 days' : 'Last 30 days'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(reportData.kpis.clicks)}</div>
            <p className="text-xs text-muted-foreground">
              {dateRange === '7d' ? 'Last 7 days' : 'Last 30 days'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CTR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.kpis.ctr}%</div>
            <p className="text-xs text-muted-foreground">
              Click-through rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(reportData.kpis.earnings)}</div>
            <p className="text-xs text-muted-foreground">
              {dateRange === '7d' ? 'Last 7 days' : 'Last 30 days'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sites">Sites</TabsTrigger>
          <TabsTrigger value="placements">Placements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                Your site performance over the {dateRange === '7d' ? 'last 7 days' : 'last 30 days'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted rounded-md flex items-center justify-center">
                <span className="text-muted-foreground">Chart placeholder - Performance metrics</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Performance</CardTitle>
              <CardDescription>
                Detailed breakdown by site
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportData.siteData.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-medium text-foreground">No site data</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    No sites found for the selected period.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reportData.siteData.map((site) => (
                    <div key={site.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{site.domain}</h3>
                        <p className="text-sm text-muted-foreground">Site ID: {site.id}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatNumber(site.impressions)} impressions</div>
                        <div className="text-sm text-muted-foreground">CTR: {site.ctr}% • {formatCurrency(site.earnings)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="placements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Placement Performance</CardTitle>
              <CardDescription>
                How your ad placements are performing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportData.placementData.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-medium text-foreground">No placement data</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    No placements found for the selected period.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reportData.placementData.map((placement) => (
                    <div key={placement.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{placement.size}</h3>
                        <p className="text-sm text-muted-foreground">Placement ID: {placement.id}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatNumber(placement.impressions)} impressions</div>
                        <div className="text-sm text-muted-foreground">CTR: {placement.ctr}% • {formatCurrency(placement.earnings)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </RequireAuth>
  );
}
