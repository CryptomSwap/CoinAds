"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Clock, Eye, User, Globe, Filter, Search, CheckSquare, Square, AlertCircle } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import { useToast } from "@/lib/toast";

export default function ApprovalsPage() {
  const { data: session, status } = useSession();
  const { success, error: showError } = useToast();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      redirect("/auth/signin");
      return;
    }

    if (session.user.role !== "ADMIN") {
      redirect("/auth/signin");
      return;
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pending approvals on component mount
  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/approvals');
      if (!response.ok) {
        throw new Error('Failed to fetch approvals');
      }
      const data = await response.json();
      setPendingApprovals(data.approvals);
    } catch (error) {
      console.error('Error fetching approvals:', error);
      setError('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id: string, action: "approve" | "reject", reason?: string) => {
    try {
      const item = pendingApprovals.find(item => item.id === id);
      if (!item) {
        throw new Error('Item not found');
      }

      const response = await fetch('/api/admin/approvals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType: item.type,
          entityId: item.entityId,
          action,
          reason,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process approval');
      }

      // Remove item from local state
      setPendingApprovals(prev => 
        prev.filter(item => item.id !== id)
      );
      
      // Show success message
      const message = action === 'approve' 
        ? `Item approved successfully` 
        : `Item rejected successfully${reason ? ' with reason: ' + reason : ''}`;
      success(message);
    } catch (error) {
      console.error(`Failed to ${action} item:`, error);
      showError(`Failed to ${action} item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleBulkAction = async (action: "approve" | "reject") => {
    if (selectedItems.length === 0) {
      showError("Please select items to perform bulk action");
      return;
    }

    if (action === "reject") {
      showError("Bulk rejection requires individual reasons. Please reject items one by one.");
      return;
    }

    try {
      // Process each selected item
      for (const itemId of selectedItems) {
        const item = pendingApprovals.find(item => item.id === itemId);
        if (item) {
          await handleApproval(itemId, action);
        }
      }
      
      setSelectedItems([]);
      success(`${selectedItems.length} items ${action}d successfully`);
    } catch (error) {
      console.error(`Failed to bulk ${action} items:`, error);
      showError(`Failed to bulk ${action} items`);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const filteredItems = getFilteredItems();
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleReviewItem = (item: any) => {
    setSelectedItem(item);
    setShowReviewModal(true);
  };

  const handleRejectClick = (item: any) => {
    setSelectedItem(item);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    
    if (selectedItem) {
      handleApproval(selectedItem.id, "reject", rejectReason);
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedItem(null);
    }
  };

  const getFilteredItems = () => {
    return pendingApprovals.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.advertiser && item.advertiser.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (item.publisher && item.publisher.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = filterType === "all" || item.type === filterType;
      const matchesStatus = filterStatus === "all" || item.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "campaign":
        return <User className="h-4 w-4" />;
      case "site":
        return <Globe className="h-4 w-4" />;
      case "creative":
        return <Eye className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
            <p className="text-muted-foreground">
              Review and approve campaigns, sites, and creatives
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading approvals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
            <p className="text-muted-foreground">
              Review and approve campaigns, sites, and creatives
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <Button 
            variant="outline" 
            onClick={fetchPendingApprovals}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve campaigns, sites, and creatives
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => handleBulkAction("approve")}
            disabled={selectedItems.length === 0}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve Selected ({selectedItems.length})
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleBulkAction("reject")}
            disabled={selectedItems.length === 0}
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject Selected ({selectedItems.length})
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, advertiser, or publisher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="campaign">Campaigns</SelectItem>
                  <SelectItem value="site">Sites</SelectItem>
                  <SelectItem value="creative">Creatives</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Actions</Label>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSelectAll}
                >
                  {selectedItems.length === getFilteredItems().length ? (
                    <Square className="h-4 w-4 mr-1" />
                  ) : (
                    <CheckSquare className="h-4 w-4 mr-1" />
                  )}
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("all");
                    setFilterStatus("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Campaigns</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingApprovals.filter(item => item.type === "campaign").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Sites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingApprovals.filter(item => item.type === "site").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Creatives</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingApprovals.filter(item => item.type === "creative").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApprovals.length}</div>
            <p className="text-xs text-muted-foreground">
              All pending items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Items</CardTitle>
          <CardDescription>
            Review and approve pending items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getFilteredItems().map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded"
                    />
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.type === "campaign" && `Advertiser: ${item.advertiser} • Budget: $${item.budget?.toLocaleString()}`}
                      {item.type === "site" && `Publisher: ${item.publisher} • Visitors: ${item.monthlyVisitors?.toLocaleString()}/month`}
                      {item.type === "creative" && `Campaign: ${item.campaign} • Format: ${item.format}`}
                    </p>
                    <p className="text-sm text-muted-foreground">Submitted: {item.submittedAt}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(item.priority)}>
                    {item.priority} priority
                  </Badge>
                  <Badge variant="outline">{item.status}</Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleReviewItem(item)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Review
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-green-500 text-green-500 hover:bg-green-50"
                    onClick={() => handleApproval(item.id, "approve")}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => handleRejectClick(item)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
            {getFilteredItems().length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No items found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Item</DialogTitle>
            <DialogDescription>
              Review details for {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm">{selectedItem.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="text-sm capitalize">{selectedItem.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <Badge className={getPriorityColor(selectedItem.priority)}>
                    {selectedItem.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant="outline">{selectedItem.status}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Submitted</Label>
                  <p className="text-sm">{selectedItem.submittedAt}</p>
                </div>
                {selectedItem.budget && (
                  <div>
                    <Label className="text-sm font-medium">Budget</Label>
                    <p className="text-sm">${selectedItem.budget.toLocaleString()}</p>
                  </div>
                )}
                {selectedItem.monthlyVisitors && (
                  <div>
                    <Label className="text-sm font-medium">Monthly Visitors</Label>
                    <p className="text-sm">{selectedItem.monthlyVisitors.toLocaleString()}</p>
                  </div>
                )}
                {selectedItem.format && (
                  <div>
                    <Label className="text-sm font-medium">Format</Label>
                    <p className="text-sm">{selectedItem.format}</p>
                  </div>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm">{selectedItem.description}</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowReviewModal(false)}
                >
                  Close
                </Button>
                <Button 
                  className="border-green-500 text-green-500 hover:bg-green-50"
                  onClick={() => {
                    handleApproval(selectedItem.id, "approve");
                    setShowReviewModal(false);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button 
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => {
                    setShowReviewModal(false);
                    handleRejectClick(selectedItem);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Reject Item
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reject-reason">Reason for rejection *</Label>
              <Textarea
                id="reject-reason"
                placeholder="Please explain why this item is being rejected..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedItem(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim()}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </RequireAuth>
  );
}
