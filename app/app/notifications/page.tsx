"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Bell, CheckCircle, AlertTriangle, Info, DollarSign, Megaphone, Globe, Check } from "lucide-react";

// Mock data
const mockNotifications = [
  {
    id: 1,
    title: "Campaign Approved",
    message: "Your Bitcoin Exchange campaign has been approved and is now live.",
    type: "success",
    context: "Campaign #123",
    timestamp: "2024-01-15 14:30",
    isRead: false,
    date: "Today",
  },
  {
    id: 2,
    title: "Low Budget Alert",
    message: "Your campaign budget is running low. Consider adding more funds.",
    type: "warning",
    context: "Campaign #122",
    timestamp: "2024-01-15 12:15",
    isRead: false,
    date: "Today",
  },
  {
    id: 3,
    title: "Payout Processed",
    message: "Your payout of $1,250.50 has been processed and sent to your account.",
    type: "success",
    context: "Payout #789",
    timestamp: "2024-01-15 10:45",
    isRead: true,
    date: "Today",
  },
  {
    id: 4,
    title: "Site Verification Required",
    message: "Please verify your domain cryptonews.com to continue receiving ads.",
    type: "info",
    context: "cryptonews.com",
    timestamp: "2024-01-14 16:20",
    isRead: true,
    date: "Yesterday",
  },
  {
    id: 5,
    title: "New Publisher Registered",
    message: "A new publisher has registered and is awaiting approval.",
    type: "info",
    context: "Publisher Account",
    timestamp: "2024-01-14 14:30",
    isRead: true,
    date: "Yesterday",
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    case "info":
      return <Info className="h-5 w-5 text-blue-600" />;
    default:
      return <Bell className="h-5 w-5 text-slate-600" />;
  }
};

const getNotificationBadge = (type: string) => {
  switch (type) {
    case "success":
      return <Badge className="bg-green-100 text-green-800">Success</Badge>;
    case "warning":
      return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
    case "info":
      return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">General</Badge>;
  }
};

export const metadata = {
  title: "Notifications - CoinAds",
  description: "View and manage your notifications",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = async () => {
    setIsMarkingAllRead(true);
    
    try {
      // TODO: Implement POST /api/notifications/mark-all-read
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = notification.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {} as Record<string, typeof notifications>);

  useEffect(() => {
    // TODO: Implement GET /api/notifications
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader 
        title="Notifications" 
        description="Stay updated with your account activities"
      >
        {unreadCount > 0 && (
          <Button 
            onClick={handleMarkAllRead}
            disabled={isMarkingAllRead}
            variant="outline"
            data-testid="btn_mark_all_read"
          >
            <Check className="mr-2 h-4 w-4" />
            {isMarkingAllRead ? "Marking..." : "Mark All Read"}
          </Button>
        )}
      </PageHeader>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-slate-600">Total Notifications</p>
                <p className="text-lg font-semibold">{notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Bell className="h-5 w-5 text-primary" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
              </div>
              <div>
                <p className="text-sm text-slate-600">Unread</p>
                <p className="text-lg font-semibold">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-slate-600">Read</p>
                <p className="text-lg font-semibold">{notifications.length - unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-12 w-12" />}
          title="No notifications"
          description="You're all caught up! New notifications will appear here."
        />
      ) : (
        <div className="space-y-6" data-testid="list_notifications">
          {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
            <Card key={date}>
              <CardHeader>
                <CardTitle className="text-lg">{date}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dateNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors ${
                        notification.isRead 
                          ? "bg-slate-50 border-slate-200" 
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-slate-900">
                                {notification.title}
                              </h4>
                              {getNotificationBadge(notification.type)}
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-slate-500">
                              <span>{notification.context}</span>
                              <span>{notification.timestamp}</span>
                            </div>
                          </div>
                          
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="ml-2"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
