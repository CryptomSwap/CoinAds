"use client";

// Force dynamic rendering for reports page
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Calendar, TrendingUp, Eye, MousePointer, AlertCircle } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";

// Types for our data
interface ReportKPIs {
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
}

interface ReportData {
  kpis: ReportKPIs;
  dailyData: Array<{
    date: string;
    impressions: number;
    clicks: number;
    spend: number;
  }>;
  campaignData: Array<{
    id: number;
    name: string;
    impressions: number;
    clicks: number;
    spend: number;
    ctr: number;
  }>;
}

// Client-side data fetching function
async function fetchAdvertiserReportsData(userId: string, dateRange: string = '7d'): Promise<ReportData> {
  const response = await fetch(`/api/reports/advertiser?dateRange=${dateRange}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch reports data');
  }

  return response.json();
}

// Filter Bar Component
function FilterBar({ dateRange, onDateRangeChange, onCampaignChange }: {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onCampaignChange: (campaignId: string) => void;
}) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4" />
        <span className="text-sm font-medium">Date Range:</span>
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Campaign:</span>
        <Select onValueChange={onCampaignChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All campaigns" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All campaigns</SelectItem>
            {/* Campaign options would be populated from props */}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Loading Skeleton Component
function LoadingSkeleton() {
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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dateRange, setDateRange] = useState('7d');
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication and role
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    if (session.user.role !== "ADVERTISER") {
      router.push("/auth/signin");
      return;
    }

    // Fetch data
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchAdvertiserReportsData(session.user.id, dateRange);
        setReportData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch advertiser reports data:", err);
        setError("Failed to load reports data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status, router, dateRange]);

  // Show loading state
  if (status === 'loading' || loading) {
    return <LoadingSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Analyze your campaign performance and metrics
            </p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show no data state
  if (!reportData) {
    return <LoadingSkeleton />;
  }

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
              Analyze your campaign performance and metrics
            </p>
          </div>
        <div className="flex space-x-2">
          <Button variant="outline" disabled>
            <Calendar className="h-4 w-4 mr-2" />
            {dateRange === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
          </Button>
          <Button 
            onClick={() => {
              const days = dateRange === '30d' ? 30 : 7;
              const dateTo = new Date();
              const dateFrom = new Date();
              dateFrom.setDate(dateFrom.getDate() - days);
              
              const dateFromStr = dateFrom.toISOString().split('T')[0];
              const dateToStr = dateTo.toISOString().split('T')[0];
              
              const url = `/api/reports/advertiser.csv?dateFrom=${dateFromStr}&dateTo=${dateToStr}${campaignFilter !== 'all' ? `&campaignId=${campaignFilter}` : ''}`;
              
              // Create a temporary link and trigger download
              const link = document.createElement('a');
              link.href = url;
              link.download = `coinads_advertiser_report_${dateFromStr}_to_${dateToStr}.csv`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
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
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(reportData.kpis.spend)}</div>
            <p className="text-xs text-muted-foreground">
              {dateRange === '7d' ? 'Last 7 days' : 'Last 30 days'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                Your campaign performance over the {dateRange === '7d' ? 'last 7 days' : 'last 30 days'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted rounded-md flex items-center justify-center">
                <span className="text-muted-foreground">Chart placeholder - Performance metrics</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>
                Detailed breakdown by campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportData.campaignData.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-medium text-foreground">No campaign data</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    No campaigns found for the selected period.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reportData.campaignData.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground">Campaign ID: {campaign.id}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatNumber(campaign.impressions)} impressions</div>
                        <div className="text-sm text-muted-foreground">CTR: {campaign.ctr}% • {formatCurrency(campaign.spend)}</div>
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
