"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  CreditCard, 
  FileImage, 
  Home, 
  Megaphone, 
  Settings,
  Globe,
  CheckCircle,
  DollarSign,
  Monitor,
  DollarSign as DollarSignIcon,
  FileText,
  TrendingUp
} from "lucide-react";

const advertiserNavItems = [
  {
    title: "Home",
    href: "/app/advertiser/overview",
    icon: Home,
  },
  {
    title: "Campaigns",
    href: "/app/advertiser/campaigns",
    icon: Megaphone,
  },
  {
    title: "Creatives",
    href: "/app/advertiser/creatives",
    icon: FileImage,
  },
  {
    title: "Reports",
    href: "/app/advertiser/reports",
    icon: BarChart3,
  },
  {
    title: "Wallet",
    href: "/app/advertiser/wallet",
    icon: CreditCard,
  },
  {
    title: "Support",
    href: "/app/advertiser/support",
    icon: Settings,
  },
];

const publisherNavItems = [
  {
    title: "Home",
    href: "/app/publisher/overview",
    icon: Home,
  },
  {
    title: "Sites",
    href: "/app/publisher/sites",
    icon: Globe,
  },
  {
    title: "Placements",
    href: "/app/publisher/placements",
    icon: CheckCircle,
  },
  {
    title: "Reports",
    href: "/app/publisher/reports",
    icon: BarChart3,
  },
  {
    title: "Earnings",
    href: "/app/publisher/earnings",
    icon: DollarSign,
  },
  {
    title: "Payouts",
    href: "/app/publisher/payouts",
    icon: DollarSignIcon,
  },
  {
    title: "Support",
    href: "/app/publisher/support",
    icon: Settings,
  },
];

const adminNavItems = [
  {
    title: "Overview",
    href: "/app/admin/overview",
    icon: Home,
  },
  {
    title: "Approvals",
    href: "/app/admin/approvals",
    icon: CheckCircle,
  },
  {
    title: "Delivery Monitor",
    href: "/app/admin/delivery",
    icon: Monitor,
  },
  {
    title: "Pricing",
    href: "/app/admin/pricing",
    icon: TrendingUp,
  },
  {
    title: "Logs",
    href: "/app/admin/logs",
    icon: FileText,
  },
  {
    title: "Transactions",
    href: "/app/admin/transactions",
    icon: DollarSign,
  },
  {
    title: "Users",
    href: "/app/admin/users",
    icon: Settings,
  },
];

interface SidebarProps {
  role: "advertiser" | "publisher" | "admin";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const navItems = role === "advertiser" 
    ? advertiserNavItems 
    : role === "publisher" 
    ? publisherNavItems 
    : adminNavItems;

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "!bg-gradient-brand hover:!bg-gradient-brand-hover !text-white"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Footer */}
      <div className="border-t p-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Monitor className="h-4 w-4" />
            <span>CoinAds Platform</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Version 1.0.0
          </div>
        </div>
      </div>
    </div>
  );
}
