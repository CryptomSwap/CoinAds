"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Eye, User, Globe } from "lucide-react";

export default function ApprovalsPage() {
  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: "1",
      type: "site",
      name: "CryptoNewsDaily.com",
      publisher: "Alex Rodriguez",
      category: "News",
      submittedAt: "1 hour ago",
      status: "pending"
    },
    {
      id: "2", 
      type: "campaign",
      name: "DeFi Protocol Launch",
      advertiser: "Blockchain Corp",
      category: "Finance",
      submittedAt: "2 hours ago",
      status: "pending"
    }
  ]);

  const handleApproval = async (id: string, action: "approve" | "reject") => {
    try {
      // In a real app, this would make an API call
      console.log(`${action} approval for item ${id}`);
      
      // Update local state for MVP
      setPendingApprovals(prev => 
        prev.filter(item => item.id !== id)
      );
      
      alert(`Item ${action}d successfully`);
    } catch (error) {
      console.error(`Failed to ${action} item:`, error);
      alert(`Failed to ${action} item`);
    }
  };

  const handleBulkAction = () => {
    alert("Bulk actions functionality would be implemented here");
  };

  const handleViewAll = () => {
    alert("View all functionality would be implemented here");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve campaigns, sites, and creatives
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleViewAll}>
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Button>
          <Button onClick={handleBulkAction}>
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Campaigns</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              +5 from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Sites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Creatives</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              +8 from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              +1 from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Approvals</CardTitle>
          <CardDescription>
            Review and approve advertiser campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="font-medium">Crypto Trading Platform Campaign</h3>
                  <p className="text-sm text-muted-foreground">Advertiser: John Smith • Budget: $5,000</p>
                  <p className="text-sm text-muted-foreground">Created: 2 hours ago</p>
                </div>
                <Badge variant="outline">Pending Review</Badge>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Review
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-green-500 text-green-500 hover:bg-green-50"
                  onClick={() => handleApproval("1", "approve")}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => handleApproval("1", "reject")}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="font-medium">DeFi Yield Farming Campaign</h3>
                  <p className="text-sm text-muted-foreground">Advertiser: Sarah Johnson • Budget: $3,500</p>
                  <p className="text-sm text-muted-foreground">Created: 4 hours ago</p>
                </div>
                <Badge variant="outline">Pending Review</Badge>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Review
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-green-500 text-green-500 hover:bg-green-50"
                  onClick={() => handleApproval("1", "approve")}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => handleApproval("1", "reject")}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="font-medium">NFT Marketplace Campaign</h3>
                  <p className="text-sm text-muted-foreground">Advertiser: Mike Chen • Budget: $7,200</p>
                  <p className="text-sm text-muted-foreground">Created: 6 hours ago</p>
                </div>
                <Badge variant="outline">Pending Review</Badge>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Review
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-green-500 text-green-500 hover:bg-green-50"
                  onClick={() => handleApproval("1", "approve")}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => handleApproval("1", "reject")}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Site Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Site Approvals</CardTitle>
          <CardDescription>
            Review and approve publisher sites
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="font-medium">CryptoNewsDaily.com</h3>
                  <p className="text-sm text-muted-foreground">Publisher: Alex Rodriguez • Category: News</p>
                  <p className="text-sm text-muted-foreground">Submitted: 1 hour ago</p>
                </div>
                <Badge variant="outline">Pending Review</Badge>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Review
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-green-500 text-green-500 hover:bg-green-50"
                  onClick={() => handleApproval("1", "approve")}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => handleApproval("1", "reject")}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="font-medium">DeFiInsights.net</h3>
                  <p className="text-sm text-muted-foreground">Publisher: Maria Garcia • Category: Analysis</p>
                  <p className="text-sm text-muted-foreground">Submitted: 3 hours ago</p>
                </div>
                <Badge variant="outline">Pending Review</Badge>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Review
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-green-500 text-green-500 hover:bg-green-50"
                  onClick={() => handleApproval("1", "approve")}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => handleApproval("1", "reject")}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Creative Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Creative Approvals</CardTitle>
          <CardDescription>
            Review and approve ad creatives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="aspect-[728/90] w-32 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-xs text-gray-500">728x90</span>
                </div>
                <div>
                  <h3 className="font-medium">Trading Platform Banner</h3>
                  <p className="text-sm text-muted-foreground">Campaign: Crypto Trading Platform</p>
                  <p className="text-sm text-muted-foreground">Uploaded: 30 minutes ago</p>
                </div>
                <Badge variant="outline">Pending Review</Badge>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Review
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-green-500 text-green-500 hover:bg-green-50"
                  onClick={() => handleApproval("1", "approve")}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => handleApproval("1", "reject")}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="aspect-square w-32 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-xs text-gray-500">300x300</span>
                </div>
                <div>
                  <h3 className="font-medium">DeFi Platform Square</h3>
                  <p className="text-sm text-muted-foreground">Campaign: DeFi Yield Farming</p>
                  <p className="text-sm text-muted-foreground">Uploaded: 1 hour ago</p>
                </div>
                <Badge variant="outline">Pending Review</Badge>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Review
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-green-500 text-green-500 hover:bg-green-50"
                  onClick={() => handleApproval("1", "approve")}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => handleApproval("1", "reject")}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
