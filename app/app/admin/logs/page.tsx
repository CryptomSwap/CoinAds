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
import { 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  User, 
  Globe, 
  Eye, 
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import RequireAuth from "@/components/RequireAuth";

interface AdminLog {
  id: number;
  action: string;
  entityType: string;
  entityId: number | null;
  adminUser: {
    id: number;
    name: string | null;
    email: string;
  };
  createdAt: string;
}

interface LogsResponse {
  logs: AdminLog[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export default function AdminLogsPage() {
  const { data: session, status } = useSession();
  
  // All hooks must be called at the top level
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterEntityType, setFilterEntityType] = useState("all");
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false,
  });

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

  // Fetch logs on component mount and when filters change
  useEffect(() => {
    fetchLogs();
  }, [searchTerm, filterAction, filterEntityType, pagination.offset]);

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

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString(),
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(`/api/admin/logs?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      const data: LogsResponse = await response.json();
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Failed to load admin logs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, offset: 0 }));
    fetchLogs();
  };

  const handleFilterChange = () => {
    setPagination(prev => ({ ...prev, offset: 0 }));
    fetchLogs();
  };

  const handlePageChange = (newOffset: number) => {
    setPagination(prev => ({ ...prev, offset: newOffset }));
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "approve":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "reject":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "create":
        return <User className="h-4 w-4 text-blue-600" />;
      case "update":
        return <RefreshCw className="h-4 w-4 text-yellow-600" />;
      case "delete":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "approve":
        return "bg-green-50 text-green-700 border-green-200";
      case "reject":
        return "bg-red-50 text-red-700 border-red-200";
      case "create":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "update":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "delete":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getEntityTypeIcon = (entityType: string) => {
    switch (entityType) {
      case "campaign":
        return <User className="h-4 w-4" />;
      case "site":
        return <Globe className="h-4 w-4" />;
      case "creative":
        return <Eye className="h-4 w-4" />;
      case "placement":
        return <Globe className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const filteredLogs = logs.filter(log => {
    const matchesAction = filterAction === "all" || log.action === filterAction;
    const matchesEntityType = filterEntityType === "all" || log.entityType === filterEntityType;
    return matchesAction && matchesEntityType;
  });

  if (loading && logs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Logs</h1>
            <p className="text-muted-foreground">
              View recent admin actions and system activity
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Logs</h1>
            <p className="text-muted-foreground">
              View recent admin actions and system activity
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <Button 
            variant="outline" 
            onClick={fetchLogs}
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
          <h1 className="text-3xl font-bold tracking-tight">Admin Logs</h1>
          <p className="text-muted-foreground">
            View recent admin actions and system activity
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchLogs}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
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
                  placeholder="Search by action, entity, or admin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Action</Label>
              <Select value={filterAction} onValueChange={(value) => {
                setFilterAction(value);
                handleFilterChange();
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="approve">Approve</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Entity Type</Label>
              <Select value={filterEntityType} onValueChange={(value) => {
                setFilterEntityType(value);
                handleFilterChange();
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="campaign">Campaigns</SelectItem>
                  <SelectItem value="site">Sites</SelectItem>
                  <SelectItem value="creative">Creatives</SelectItem>
                  <SelectItem value="placement">Placements</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Actions</Label>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSearch}
                >
                  Search
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSearchTerm("");
                    setFilterAction("all");
                    setFilterEntityType("all");
                    setPagination(prev => ({ ...prev, offset: 0 }));
                  }}
                >
                  Clear
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
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
            <p className="text-xs text-muted-foreground">
              All admin actions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approvals</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter(log => log.action === "approve").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Approved items
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejections</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter(log => log.action === "reject").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Rejected items
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Other Actions</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter(log => !["approve", "reject"].includes(log.action)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Create/Update/Delete
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Admin Actions</CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} of {pagination.total} logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getActionIcon(log.action)}
                    {getEntityTypeIcon(log.entityType)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                      <Badge variant="outline">
                        {log.entityType}
                      </Badge>
                      {log.entityId && (
                        <Badge variant="secondary">
                          ID: {log.entityId}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Admin: {log.adminUser.name || log.adminUser.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(log.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No logs found matching your criteria.
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} logs
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))}
                  disabled={pagination.offset === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.offset + pagination.limit)}
                  disabled={!pagination.hasMore}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </RequireAuth>
  );
}