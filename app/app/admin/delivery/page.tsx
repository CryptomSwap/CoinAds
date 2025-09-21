"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Activity, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";

export default function DeliveryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery Monitor</h1>
          <p className="text-muted-foreground">
            Monitor ad delivery performance and system health
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button>
            Export Report
          </Button>
        </div>
      </div>

      {/* System Status */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All systems running normally
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              +23 from last hour
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions/min</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,678</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last hour
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.12%</div>
            <p className="text-xs text-muted-foreground">
              -0.03% from last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Delivery Metrics</CardTitle>
          <CardDescription>
            Live performance data for ad delivery
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-gray-100 rounded-md flex items-center justify-center">
            <span className="text-gray-500">Chart placeholder - Real-time delivery metrics</span>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Campaigns</CardTitle>
          <CardDescription>
            Campaigns with highest delivery rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Crypto Trading Platform</h3>
                <p className="text-sm text-muted-foreground">Advertiser: John Smith</p>
              </div>
              <div className="text-right">
                <div className="font-medium">98.5% delivery rate</div>
                <div className="text-sm text-muted-foreground">45,678 impressions/hour</div>
              </div>
              <Badge variant="secondary">Excellent</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">DeFi Yield Farming</h3>
                <p className="text-sm text-muted-foreground">Advertiser: Sarah Johnson</p>
              </div>
              <div className="text-right">
                <div className="font-medium">96.2% delivery rate</div>
                <div className="text-sm text-muted-foreground">32,456 impressions/hour</div>
              </div>
              <Badge variant="secondary">Good</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">NFT Marketplace</h3>
                <p className="text-sm text-muted-foreground">Advertiser: Mike Chen</p>
              </div>
              <div className="text-right">
                <div className="font-medium">94.8% delivery rate</div>
                <div className="text-sm text-muted-foreground">28,901 impressions/hour</div>
              </div>
              <Badge variant="secondary">Good</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>
            Recent system notifications and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="font-medium">High delivery volume detected</p>
                <p className="text-sm text-muted-foreground">Peak traffic hour - 2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="font-medium">Campaign budget approaching limit</p>
                <p className="text-sm text-muted-foreground">Crypto Trading Platform - 5 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="font-medium">New campaign approved and live</p>
                <p className="text-sm text-muted-foreground">NFT Marketplace Campaign - 12 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="font-medium">Scheduled maintenance completed</p>
                <p className="text-sm text-muted-foreground">Database optimization - 1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
          <CardDescription>
            Ad delivery by geographic region
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-gray-100 rounded-md flex items-center justify-center">
            <span className="text-gray-500">Chart placeholder - Geographic distribution</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
