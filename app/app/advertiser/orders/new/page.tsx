"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewOrderPage() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState("USD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/advertiser/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          notes,
          totalAmountMicros: BigInt(Math.round(amount * 1_000_000)).toString(),
          currency,
        }),
      });

      if (res.ok) {
        router.push("/app/advertiser/orders");
      } else {
        const error = await res.json();
        alert(`Failed to create order: ${error.error?.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link 
          href="/app/advertiser/orders"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Orders
        </Link>
        <h1 className="text-2xl font-semibold mt-2">New Order</h1>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required
            placeholder="e.g., Q4 Banner Campaign"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
            value={notes} 
            onChange={e => setNotes(e.target.value)}
            rows={4}
            placeholder="Additional details about this order..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount ($) *</label>
            <input 
              type="number" 
              min="0" 
              step="0.01" 
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
              value={amount} 
              onChange={e => setAmount(parseFloat(e.target.value || "0"))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={currency} 
              onChange={e => setCurrency(e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50" 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Order"}
          </button>
          <Link 
            href="/app/advertiser/orders"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
