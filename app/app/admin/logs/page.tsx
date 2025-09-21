"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Filter, User, Calendar, Activity } from "lucide-react";

// Mock data
const mockLogs = [
  {
    id: 1,
    timestamp: "2024-01-15 14:30:25",
    user: "john.doe@example.com",
    action: "campaign_created",
    entity: "Campaign #123",
    notes: "Created new Bitcoin exchange campaign",
  },
  {
    id: 2,
    timestamp: "2024-01-15 14:25:10",
    user: "admin@coinads.com",
    action: "pricing_updated",
    entity: "Placement #456",
    notes: "Updated CPM from $2.50 to $3.20",
  },
  {
    id: 3,
    timestamp: "2024-01-15 14:20:45",
    user: "jane.smith@example.com",
    action: "site_verified",
    entity: "cryptonews.com",
    notes: "Domain verification completed",
  },
  {
    id: 4,
    timestamp: "2024-01-15 14:15:30",
    user: "bob.wilson@example.com",
    action: "payout_requested",
    entity: "Payout #789",
    notes: "Requested payout of $1,250.50",
  },
  {
    id: 5,
    timestamp: "2024-01-15 14:10:15",
    user: "admin@coinads.com",
    action: "user_approved",
    entity: "Publisher Account",
    notes: "Approved new publisher registration",
  },
];

const actionTypes = [
  "all",
  "campaign_created",
  "campaign_updated",
  "pricing_updated",
  "site_verified",
  "payout_requested",
  "user_approved",
  "user_suspended",
];

const getActionBadge = (action: string) => {
  const actionConfig: Record<string, { color: string; label: string }> = {
    campaign_created: { color: "bg-green-100 text-green-800", label: "Campaign Created" },
    campaign_updated: { color: "bg-blue-100 text-blue-800", label: "Campaign Updated" },
    pricing_updated: { color: "bg-purple-100 text-purple-800", label: "Pricing Updated" },
    site_verified: { color: "bg-green-100 text-green-800", label: "Site Verified" },
    payout_requested: { color: "bg-yellow-100 text-yellow-800", label: "Payout Requested" },
    user_approved: { color: "bg-green-100 text-green-800", label: "User Approved" },
    user_suspended: { color: "bg-red-100 text-red-800", label: "User Suspended" },
  };
  
  const config = actionConfig[action] || { color: "bg-gray-100 text-gray-800", label: action };
  return <Badge className={config.color}>{config.label}</Badge>;
};

export const metadata = {
  title: "Audit Logs - CoinAds Admin",
  description: "View system audit logs and user activities",
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState(mockLogs);
  const [filteredLogs, setFilteredLogs] = useState(mockLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActionType, setSelectedActionType] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let filtered = logs;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(log => 
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.notes.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by action type
    if (selectedActionType !== "all") {
      filtered = filtered.filter(log => log.action === selectedActionType);
    }

    setFilteredLogs(filtered);
  }, [logs, searchQuery, selectedActionType]);

  const handleSearch = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Implement GET /api/admin/logs?query=&actionType=&limit=...
      const params = new URLSearchParams({
        query: searchQuery,
        actionType: selectedActionType,
        limit: "100",
      });
      
      const response = await fetch(`/api/admin/logs?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    handleSearch();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader 
        title="Audit Logs" 
        description="Monitor system activities and user actions"
      />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by user, entity, or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input_search_logs"
                />
              </div>
            </div>
            
            <Select value={selectedActionType} onValueChange={setSelectedActionType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                {actionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Actions" : type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
            
            <Button variant="outline" onClick={handleRefresh}>
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Activity Logs
            </div>
            <Badge variant="secondary">
              {filteredLogs.length} entries
            </Badge>
          </CardTitle>
          <CardDescription>
            Recent system activities and user actions (reverse chronological order)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table data-testid="tbl_admin_logs">
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="font-mono text-sm">{log.timestamp}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="font-medium">{log.user}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getActionBadge(log.action)}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{log.entity}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">{log.notes}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <Activity className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-900">No logs found</h3>
              <p className="mt-1 text-sm text-slate-500">
                Try adjusting your search criteria or refresh the data.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-slate-600">Total Logs</p>
                <p className="text-lg font-semibold">{logs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-slate-600">Unique Users</p>
                <p className="text-lg font-semibold">
                  {new Set(logs.map(log => log.user)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-slate-600">Action Types</p>
                <p className="text-lg font-semibold">
                  {new Set(logs.map(log => log.action)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-slate-600">Today's Activity</p>
                <p className="text-lg font-semibold">
                  {logs.filter(log => log.timestamp.startsWith("2024-01-15")).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
