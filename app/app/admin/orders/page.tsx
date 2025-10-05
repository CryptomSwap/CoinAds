"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";

interface Order {
  id: number;
  title: string;
  notes?: string;
  totalAmountMicros: string;
  currency: string;
  status: string;
  createdAt: string;
  advertiser: {
    id: number;
    email: string;
    name?: string;
  };
  campaign?: {
    id: number;
    name: string;
  };
}

async function ChangeStatus(id: number, status: string) {
  try {
    await fetch(`/api/admin/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    // Refresh the page to show updated status
    window.location.reload();
  } catch (error) {
    console.error("Error updating order status:", error);
  }
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/admin/orders");
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

    if (session?.user.role === "ADMIN") {
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
        <h1 className="text-2xl font-semibold">Orders Management</h1>
        
        <div className="rounded-xl border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="p-3 text-left">Advertiser</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-center">Campaign</th>
                <th className="p-3 text-center">Amount</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Created</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{order.advertiser.name || "Unknown"}</div>
                      <div className="text-xs text-muted-foreground">{order.advertiser.email}</div>
                    </div>
                  </td>
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
                  <td className="p-3 text-center">
                    <div className="flex gap-2 justify-center">
                      {order.status === "PENDING" && (
                        <>
                          <button 
                            className="inline-flex items-center justify-center rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700" 
                            onClick={() => ChangeStatus(order.id, "APPROVED")}
                          >
                            Approve
                          </button>
                          <button 
                            className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700" 
                            onClick={() => ChangeStatus(order.id, "REJECTED")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {order.status !== "PENDING" && (
                        <span className="text-xs text-muted-foreground">No actions</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No orders found.
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