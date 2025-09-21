"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, 
  Search, 
  Globe, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Copy,
  ExternalLink
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Site {
  id: string;
  domain: string;
  name: string;
  description?: string;
  category?: string;
  status: string;
  verificationToken?: string;
  verifiedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  placements: any[];
  _count: {
    placements: number;
  };
}

export default function SitesPage() {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchSites();
  }, [statusFilter]);

  const fetchSites = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await fetch(`/api/publisher/sites?${params}`);
      const data = await response.json();

      if (response.ok) {
        setSites(data.sites);
      } else {
        setError(data.error || "Failed to fetch sites");
      }
    } catch (error) {
      setError("Error fetching sites");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySite = async (siteId: string) => {
    try {
      const response = await fetch(`/api/publisher/sites/${siteId}`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        fetchSites(); // Refresh the list
      } else {
        setError(data.error || "Failed to verify site");
      }
    } catch (error) {
      setError("Error verifying site");
    }
  };

  const handleDeleteSite = async (siteId: string) => {
    if (!confirm("Are you sure you want to delete this site? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/publisher/sites/${siteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccess("Site deleted successfully");
        fetchSites(); // Refresh the list
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete site");
      }
    } catch (error) {
      setError("Error deleting site");
    }
  };

  const copyVerificationToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setSuccess("Verification token copied to clipboard");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gradient-start border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sites & Placements</h1>
          <p className="text-muted-foreground">
            Manage your websites and ad placements
          </p>
        </div>
        <Link href="/app/publisher/sites/new">
          <Button className="!bg-gradient-brand hover:!bg-gradient-brand-hover !text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Plus className="h-4 w-4 mr-2" />
            Add New Site
          </Button>
        </Link>
      </div>

      {/* Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search sites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sites List */}
      {filteredSites.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-gradient-start/10 to-gradient-end/10 flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-gradient-start" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm ? "No sites found" : "No sites yet"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchTerm 
                  ? "Try adjusting your search terms to find your sites"
                  : "Add your first website to start earning from crypto advertising"
                }
              </p>
              {!searchTerm && (
                <Link href="/app/publisher/sites/new">
                  <Button className="!bg-gradient-brand hover:!bg-gradient-brand-hover !text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Site
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSites.map((site) => (
            <Card key={site.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-gradient-start/10 to-gradient-end/10 rounded-full">
                      <Globe className="h-5 w-5 text-gradient-start" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{site.name}</h3>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-muted-foreground">{site.domain}</p>
                        <a 
                          href={`https://${site.domain}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gradient-start hover:text-gradient-end transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      {site.description && (
                        <p className="text-sm text-muted-foreground mt-1">{site.description}</p>
                      )}
                    </div>
                    {getStatusBadge(site.status)}
                  </div>

                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="font-semibold">
                        {site._count.placements}
                      </div>
                      <div className="text-muted-foreground">Placements</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">
                        {new Date(site.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-muted-foreground">Added</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link href={`/app/publisher/sites/${site.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/app/publisher/sites/${site.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        {site.status === "PENDING" && site.verificationToken && (
                          <DropdownMenuItem onClick={() => copyVerificationToken(site.verificationToken!)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Verification Token
                          </DropdownMenuItem>
                        )}
                        {site.status === "PENDING" && (
                          <DropdownMenuItem onClick={() => handleVerifySite(site.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Verify Site
                          </DropdownMenuItem>
                        )}
                        {site.status === "PENDING" && (
                          <DropdownMenuItem 
                            onClick={() => handleDeleteSite(site.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Verification Instructions */}
                {site.status === "PENDING" && site.verificationToken && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 dark:from-yellow-900/20 dark:to-orange-900/20 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mr-3">
                        <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Verification Required</h4>
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                      Add this verification token to your website's HTML head section:
                    </p>
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800 font-mono text-sm text-yellow-800 dark:text-yellow-200">
                      &lt;meta name="coinads-verification" content="{site.verificationToken}"&gt;
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-3">
                      After adding the token, click "Verify Site" to complete verification.
                    </p>
                  </div>
                )}

                {/* Rejection Reason */}
                {site.status === "REJECTED" && site.rejectionReason && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-800 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full mr-3">
                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <h4 className="font-semibold text-red-800 dark:text-red-200">Site Rejected</h4>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300">{site.rejectionReason}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
