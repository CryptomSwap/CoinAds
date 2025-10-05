"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";

interface Order {
  id: number;
  title: string;
  notes?: string;
  totalAmountMicros: string;
  currency: string;
  status: string;
  createdAt: string;
  campaign?: {
    id: number;
    name: string;
  };
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      redirect("/auth/signin");
      return;
    }

    if (session.user.role !== "ADVERTISER") {
      redirect("/auth/signin");
      return;
    }
  }, [session, status]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/advertiser/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user.role === "ADVERTISER") {
      fetchOrders();
    }
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <RequireAuth>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading orders...</div>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Orders</h1>
          <Link 
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90" 
            href="/app/advertiser/orders/new"
          >
            New Order
          </Link>
        </div>
        
        <div className="rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-center">Campaign</th>
                <th className="p-3 text-center">Amount</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-3">{order.title}</td>
                  <td className="p-3 text-center">
                    {order.campaign?.name || "No campaign"}
                  </td>
                  <td className="p-3 text-center">
                    ${Number(order.totalAmountMicros) / 1_000_000} {order.currency}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                      order.status === "APPROVED" ? "bg-green-100 text-green-800" :
                      order.status === "REJECTED" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No orders found. Create your first order to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </RequireAuth>
  );
}