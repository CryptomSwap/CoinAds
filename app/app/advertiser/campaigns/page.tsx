"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus,
  Search,
  MoreHorizontal,
  Play,
  Pause,
  Copy,
  Trash2
} from "lucide-react";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";

// Mock data for MVP
const mockCampaigns = [
  {
    id: "1",
    name: "Crypto Exchange Launch",
    status: "ACTIVE",
    impressions: 45230,
    clicks: 1023,
    spend: 450.25,
    updatedAt: "2024-01-15"
  },
  {
    id: "2", 
    name: "DeFi Protocol Campaign",
    status: "PAUSED",
    impressions: 32100,
    clicks: 756,
    spend: 320.10,
    updatedAt: "2024-01-14"
  },
  {
    id: "3",
    name: "NFT Marketplace Promo",
    status: "PENDING",
    impressions: 0,
    clicks: 0,
    spend: 0,
    updatedAt: "2024-01-16"
  },
  {
    id: "4",
    name: "Blockchain Education Series",
    status: "ACTIVE",
    impressions: 28900,
    clicks: 567,
    spend: 289.50,
    updatedAt: "2024-01-15"
  },
  {
    id: "5",
    name: "Crypto Wallet Promotion",
    status: "COMPLETED",
    impressions: 156700,
    clicks: 3421,
    spend: 1567.00,
    updatedAt: "2024-01-10"
  }
];

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Paused", value: "PAUSED" },
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" }
];

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [campaigns, setCampaigns] = useState(mockCampaigns);

  const handleStatusChange = async (campaignId: string, newStatus: string) => {
    try {
      // In a real app, this would make an API call
      console.log(`Changing campaign ${campaignId} status to ${newStatus}`);
      
      // Update local state for MVP
      setCampaigns(prev => 
        prev.map(campaign => 
          campaign.id === campaignId 
            ? { ...campaign, status: newStatus }
            : campaign
        )
      );
      
      alert(`Campaign status changed to ${newStatus}`);
    } catch (error) {
      console.error("Failed to change campaign status:", error);
      alert("Failed to change campaign status");
    }
  };

  const handleCopyCampaign = async (campaignId: string) => {
    try {
      // In a real app, this would make an API call to duplicate the campaign
      console.log(`Copying campaign ${campaignId}`);
      alert("Campaign copy functionality would be implemented here");
    } catch (error) {
      console.error("Failed to copy campaign:", error);
      alert("Failed to copy campaign");
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
      try {
        // In a real app, this would make an API call
        console.log(`Deleting campaign ${campaignId}`);
        
        // Update local state for MVP
        setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId));
        
        alert("Campaign deleted successfully");
      } catch (error) {
        console.error("Failed to delete campaign:", error);
        alert("Failed to delete campaign");
      }
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
      case 'PENDING': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <RequireAuth>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your advertising campaigns
          </p>
        </div>
        <Button asChild>
          <Link href="/app/advertiser/campaigns/new">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search campaigns, sites, placements"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2">
              {statusFilters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={statusFilter === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(filter.value)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
          <CardDescription>
            {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCampaigns.length > 0 ? (
            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-sm font-medium">{campaign.name}</h3>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">{formatNumber(campaign.impressions)}</span> impressions
                      </div>
                      <div>
                        <span className="font-medium">{formatNumber(campaign.clicks)}</span> clicks
                      </div>
                      <div>
                        <span className="font-medium">{formatCurrency(campaign.spend)}</span> spent
                      </div>
                      <div>
                        Updated {campaign.updatedAt}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/app/advertiser/campaigns/${campaign.id}`}>
                        View
                      </Link>
                    </Button>
                    {campaign.status === "ACTIVE" ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusChange(campaign.id, "PAUSED")}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : campaign.status === "PAUSED" ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusChange(campaign.id, "ACTIVE")}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    ) : null}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCopyCampaign(campaign.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteCampaign(campaign.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Search className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by creating your first campaign."
                }
              </p>
              {!searchTerm && statusFilter === "all" && (
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/app/advertiser/campaigns/new">
                      <Plus className="mr-2 h-4 w-4" />
                      New Campaign
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </RequireAuth>
  );
}