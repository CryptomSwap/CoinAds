"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Mail, Phone, Calendar, Search, Filter, Loader2 } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";

interface UserData {
  id: number;
  email: string;
  name: string;
  role: string;
  emailVerified: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UserStats {
  total: number;
  advertisers: number;
  publishers: number;
  admins: number;
}

export default function UsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<UserStats>({ total: 0, advertisers: 0, publishers: 0, admins: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

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

    fetchUsers();
  }, [session, status, activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const role = activeTab === "all" ? "" : activeTab;
      const response = await fetch(`/api/admin/users?role=${role}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      
      const data = await response.json();
      setUsers(data.users);
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "ADVERTISER":
        return "bg-blue-100 text-blue-800";
      case "PUBLISHER":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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

  const handleFilter = () => {
    alert("User filter functionality would be implemented here");
  };

  const handleAddUser = () => {
    alert("Add user functionality would be implemented here");
  };

  return (
    <RequireAuth>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage platform users and permissions
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleFilter}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button onClick={handleAddUser}>
            <User className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Advertisers</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.advertisers}</div>
            <p className="text-xs text-muted-foreground">
              Advertiser accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publishers</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishers}</div>
            <p className="text-xs text-muted-foreground">
              Publisher accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
            <p className="text-xs text-muted-foreground">
              Admin accounts
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="advertisers">Advertisers</TabsTrigger>
          <TabsTrigger value="publishers">Publishers</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "all" ? "All Users" : 
                 activeTab === "advertisers" ? "Advertisers" :
                 activeTab === "publishers" ? "Publishers" : "Administrators"}
              </CardTitle>
              <CardDescription>
                {activeTab === "all" ? "Complete user directory" :
                 activeTab === "advertisers" ? "Users with advertiser accounts" :
                 activeTab === "publishers" ? "Users with publisher accounts" : "Platform administrators"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center text-red-600 py-8">
                  <p>Error: {error}</p>
                  <Button onClick={fetchUsers} className="mt-2">
                    Retry
                  </Button>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No users found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{user.name || "No name"}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Joined: {formatDate(user.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          {user.emailVerified ? "Verified" : "Unverified"}
                        </div>
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
