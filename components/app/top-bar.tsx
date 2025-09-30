"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";
import { useRole } from "@/contexts/RoleContext";
import { 
  Bell, 
  ChevronDown, 
  HelpCircle, 
  Plus, 
  Search, 
  User,
  Wallet,
  Settings,
  LogOut,
  CheckCircle,
  AlertTriangle,
  Info,
  Check
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WalletDrawer } from "./wallet-drawer";
import { TopUpModal } from "./top-up-modal";

// Mock notifications data
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
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case "info":
      return <Info className="h-4 w-4 text-blue-600" />;
    default:
      return <Bell className="h-4 w-4 text-slate-600" />;
  }
};

export function TopBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { currentRole, setCurrentRole } = useRole();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const formatBalance = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const handleRoleChange = (role: "advertiser" | "publisher" | "admin") => {
    setCurrentRole(role);
    
    // Redirect to the appropriate overview page
    if (role === "advertiser") {
      router.push("/app/advertiser/overview");
    } else if (role === "publisher") {
      router.push("/app/publisher/overview");
    } else {
      router.push("/app/admin/overview");
    }
  };

  const getRoleDisplayName = (role: "advertiser" | "publisher" | "admin") => {
    return role === "advertiser" ? "Advertiser" : role === "publisher" ? "Publisher" : "Admin";
  };

  const getBalanceDisplay = () => {
    if (currentRole === "advertiser") {
      return "Balance: $1,500.00";
    } else if (currentRole === "publisher") {
      return "Earnings: $1,250.00";
    } else {
      return "Admin Panel";
    }
  };

  const getSearchPlaceholder = () => {
    if (currentRole === "advertiser") {
      return "Search campaigns, creatives...";
    } else if (currentRole === "publisher") {
      return "Search sites, earnings...";
    } else {
      return "Search users, campaigns...";
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl h-full">
          <div className="flex h-16 items-center">
            {/* Logo - positioned at the very edge */}
            <div className="flex-shrink-0">
              <Logo href="/app" className="text-foreground" />
            </div>

            {/* Middle Section */}
            <div className="flex items-center space-x-4 flex-1 justify-center mx-12">
              {/* Role Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-1 text-muted-foreground hover:text-foreground">
                    <span>{getRoleDisplayName(currentRole)}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem 
                    onClick={() => handleRoleChange("advertiser")}
                    className={currentRole === "advertiser" ? "bg-accent" : ""}
                  >
                    Advertiser
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleRoleChange("publisher")}
                    className={currentRole === "publisher" ? "bg-accent" : ""}
                  >
                    Publisher
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleRoleChange("admin")}
                    className={currentRole === "admin" ? "bg-accent" : ""}
                  >
                    Admin
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Org Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-1 text-muted-foreground hover:text-foreground">
                    <span>CoinAds Demo</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>CoinAds Demo</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Global Search */}
              <div className="w-80">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={getSearchPlaceholder()}
                    className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-3 flex-shrink-0 pr-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Balance */}
              <Button
                variant="outline"
                onClick={() => setIsWalletOpen(true)}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
              >
                <Wallet className="h-4 w-4" />
                <span>{getBalanceDisplay()}</span>
              </Button>

              {/* Add Credits - Only show for advertisers */}
              {currentRole === "advertiser" && (
                <Button 
                  onClick={() => setIsTopUpOpen(true)}
                  className="!bg-gradient-brand hover:!bg-gradient-brand-hover !text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Credits
                </Button>
              )}

              {/* Notifications */}
              <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative text-muted-foreground hover:text-foreground"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-brand text-white flex items-center justify-center">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Notifications</h3>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleMarkAllRead}
                          className="text-xs"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Mark all read
                        </Button>
                      )}
                    </div>
                  </div>
                  <ScrollArea className="max-h-96">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    ) : (
                      <div className="p-2">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`flex items-start space-x-3 p-3 rounded-lg transition-colors hover:bg-accent ${
                              notification.isRead 
                                ? "bg-transparent" 
                                : "bg-blue-50 dark:bg-blue-950/20"
                            }`}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-foreground">
                                    {notification.title}
                                  </h4>
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                                    <span>{notification.context}</span>
                                    <span>•</span>
                                    <span>{notification.timestamp}</span>
                                  </div>
                                </div>
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="ml-2 h-6 w-6 p-0"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                  <div className="p-3 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        router.push('/app/notifications');
                      }}
                    >
                      View all notifications
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Help */}
              <Button 
                variant="ghost" 
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => router.push('/contact')}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>

              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
                    <div className="h-8 w-8 rounded-full bg-gradient-brand flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span>{session?.user?.name || "User"}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/app/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/app/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <WalletDrawer open={isWalletOpen} onOpenChange={setIsWalletOpen} />
      <TopUpModal open={isTopUpOpen} onOpenChange={setIsTopUpOpen} />
    </>
  );
}
