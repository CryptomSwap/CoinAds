import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Calendar, TrendingUp, Eye, MousePointer, DollarSign, AlertCircle } from "lucide-react";

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

// Server component to fetch publisher reports data
async function getPublisherReportsData(userId: string, dateRange: string = '7d'): Promise<PublisherReportData> {
  const days = dateRange === '30d' ? 30 : 7;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get KPIs from impressions and clicks
  const impressionData = await prisma.impression.aggregate({
    where: {
      site: {
        publisherId: parseInt(userId),
      },
      createdAt: {
        gte: startDate,
      },
    },
    _sum: {
      costMicros: true,
    },
    _count: {
      id: true,
    },
  });

  const clickData = await prisma.click.count({
    where: {
      impression: {
        site: {
          publisherId: parseInt(userId),
        },
      },
      createdAt: {
        gte: startDate,
      },
    },
  });

  // Get site data with performance
  const sites = await prisma.site.findMany({
    where: {
      publisherId: parseInt(userId),
    },
    include: {
      impressions: {
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      },
    },
  });

  // Get placement data with performance
  const placements = await prisma.placement.findMany({
    where: {
      site: {
        publisherId: parseInt(userId),
      },
    },
    include: {
      impressions: {
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        include: {
          clicks: {
            where: {
              createdAt: {
                gte: startDate,
              },
            },
          },
        },
      },
    },
  });

  // Process KPIs
  const impressions = impressionData._count.id || 0;
  const clicks = clickData;
  const totalCostMicros = impressionData._sum.costMicros || 0;
  const totalCost = totalCostMicros / 1000000; // Convert from micro-cents to dollars
  const earnings = totalCost * 0.7; // 70% publisher share
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

  // Process site data
  const siteData = sites.map(site => {
    const siteImpressions = site.impressions.length;
    const siteClicks = 0; // We'll need to calculate this differently since we don't have direct clicks relation
    const siteCostMicros = site.impressions.reduce((sum, impression) => sum + impression.costMicros, 0);
    const siteCost = siteCostMicros / 1000000;
    const siteEarnings = siteCost * 0.7;
    const siteCtr = siteImpressions > 0 ? (siteClicks / siteImpressions) * 100 : 0;

    return {
      id: site.id,
      domain: site.domain,
      impressions: siteImpressions,
      clicks: siteClicks,
      earnings: siteEarnings,
      ctr: Math.round(siteCtr * 100) / 100,
    };
  });

  // Process placement data
  const placementData = placements.map(placement => {
    const placementImpressions = placement.impressions.length;
    const placementClicks = placement.impressions.reduce((sum, impression) => sum + impression.clicks.length, 0);
    const placementCostMicros = placement.impressions.reduce((sum, impression) => sum + impression.costMicros, 0);
    const placementCost = placementCostMicros / 1000000;
    const placementEarnings = placementCost * 0.7;
    const placementCtr = placementImpressions > 0 ? (placementClicks / placementImpressions) * 100 : 0;

    return {
      id: placement.id,
      size: placement.size,
      impressions: placementImpressions,
      clicks: placementClicks,
      earnings: placementEarnings,
      ctr: Math.round(placementCtr * 100) / 100,
    };
  });

  return {
    kpis: {
      impressions,
      clicks,
      ctr: Math.round(ctr * 100) / 100,
      earnings,
    },
    dailyData: [], // Would need to implement daily aggregation
    siteData,
    placementData,
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

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { dateRange?: string; site?: string; placement?: string };
}) {
  // Check authentication and role
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "PUBLISHER") {
    redirect("/auth/signin");
  }

  const dateRange = searchParams.dateRange || '7d';
  const siteFilter = searchParams.site || 'all';
  const placementFilter = searchParams.placement || 'all';

  let reportData: PublisherReportData;
  let error: string | null = null;

  try {
    reportData = await getPublisherReportsData(session.user.id, dateRange);
  } catch (err) {
    console.error("Failed to fetch publisher reports data:", err);
    error = "Failed to load reports data. Please try again later.";
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Analyze your site performance and earnings
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
  );
}
