"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DollarSign, 
  Eye, 
  MousePointer, 
  TrendingUp,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Wallet
} from "lucide-react";

interface EarningsSummary {
  totalEarnings: number;
  totalImpressions: number;
  totalClicks: number;
  overallCtr: number;
  totalPayouts: number;
  pendingEarnings: number;
}

interface SiteEarnings {
  siteId: string;
  siteName: string;
  domain: string;
  impressions: number;
  clicks: number;
  ctr: number;
  earnings: number;
}

interface Payout {
  id: string;
  amountCents: number;
  status: string;
  method?: string;
  createdAt: string;
}

interface EarningsData {
  summary: EarningsSummary;
  sites: SiteEarnings[];
  payouts: Payout[];
}

export default function EarningsPage() {
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSite, setSelectedSite] = useState("all");

  useEffect(() => {
    fetchEarnings();
  }, [selectedSite]);

  const fetchEarnings = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedSite !== "all") {
        params.append("siteId", selectedSite);
      }

      const response = await fetch(`/api/publisher/earnings?${params}`);
      const data = await response.json();

      if (response.ok) {
        setEarningsData(data);
      } else {
        setError(data.error || "Failed to fetch earnings");
      }
    } catch (error) {
      setError("Error fetching earnings");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const getPayoutStatusBadge = (status: string) => {
    switch (status) {
      case "SENT":
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Sent</Badge>;
      case "REQUESTED":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "FAILED":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleRequestPayout = async () => {
    // For MVP, we'll simulate a payout request
    alert("Payout request feature coming soon!");
  };

  const handleExportData = () => {
    if (!earningsData) return;
    
    const csvData = [
      ["Site", "Domain", "Impressions", "Clicks", "CTR", "Earnings"],
      ...earningsData.sites.map(site => [
        site.siteName,
        site.domain,
        site.impressions.toString(),
        site.clicks.toString(),
        `${site.ctr}%`,
        formatCurrency(site.earnings)
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `earnings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error || !earningsData) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Earnings</h1>
        <Alert variant="destructive">
          <AlertDescription>{error || "Failed to load earnings"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const { summary, sites, payouts } = earningsData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Earnings</h1>
          <p className="text-muted-foreground">
            Track your revenue and payout history
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={handleRequestPayout}>
            <Wallet className="h-4 w-4 mr-2" />
            Request Payout
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalEarnings)}</div>
            <p className="text-xs text-muted-foreground">
              All time earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.pendingEarnings)}</div>
            <p className="text-xs text-muted-foreground">
              Available for payout
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalImpressions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Ad views served
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall CTR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.overallCtr}%</div>
            <p className="text-xs text-muted-foreground">
              Click-through rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Site Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Site</label>
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select a site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  {sites.map((site) => (
                    <SelectItem key={site.siteId} value={site.siteId}>
                      {site.siteName} ({site.domain})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Site Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Site Performance</CardTitle>
          <CardDescription>
            Earnings breakdown by site
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sites.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 rounded bg-gray-100 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No earnings data
              </h3>
              <p className="text-gray-500">
                Start serving ads to see your earnings here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sites.map((site) => (
                <div key={site.siteId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-semibold">{site.siteName}</h3>
                      <p className="text-sm text-muted-foreground">{site.domain}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="font-semibold">
                        {site.impressions.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">Impressions</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">
                        {site.clicks.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">Clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{site.ctr}%</div>
                      <div className="text-muted-foreground">CTR</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">
                        {formatCurrency(site.earnings)}
                      </div>
                      <div className="text-muted-foreground">Earnings</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
          <CardDescription>
            Your recent payout transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payouts.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 rounded bg-gray-100 flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No payouts yet
              </h3>
              <p className="text-gray-500">
                Your payout history will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {payouts.map((payout) => (
                <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <Wallet className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Payout #{payout.id.slice(-8)}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payout.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        {formatCurrency(payout.amountCents)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {payout.method || "USDT"}
                      </div>
                    </div>
                    {getPayoutStatusBadge(payout.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
