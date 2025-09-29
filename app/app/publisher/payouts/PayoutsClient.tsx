"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DollarSign, CreditCard, History, Settings, AlertCircle, CheckCircle, Clock } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";

// Mock data
const emptyPayoutHistory = [
  { id: 1, date: "2024-01-15", amount: 1250.50, status: "completed", ref: "PAY-001" },
  { id: 2, date: "2024-01-01", amount: 980.25, status: "completed", ref: "PAY-002" },
  { id: 3, date: "2023-12-15", amount: 750.00, status: "pending", ref: "PAY-003" },
];

const emptyPayoutMethods = [
  { id: 1, type: "IBAN", value: "****1234", isDefault: true },
  { id: 2, type: "PayPal", value: "user@example.com", isDefault: false },
  { id: 3, type: "BTC", value: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", isDefault: false },
];

export default function PayoutsClient() {
  const [currentBalance] = useState(1250.75);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canRequestPayout = currentBalance >= 100;

  const handleRequestPayout = async () => {
    setIsSubmitting(true);
    
    try {
      // TODO: Implement POST /api/publisher/payouts
      const response = await fetch("/api/publisher/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(payoutAmount),
          methods: selectedMethods,
          note,
        }),
      });
      
      if (response.ok) {
        setIsRequestModalOpen(false);
        setPayoutAmount("");
        setSelectedMethods([]);
        setNote("");
      }
    } catch (error) {
      console.error("Failed to request payout:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Failed</Badge>;
    }
  };

  return (
    <RequireAuth>
      <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader 
        title="Payouts" 
        description="Request payouts and manage your payment methods"
      />

      {/* Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Current Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-primary">${currentBalance.toLocaleString()}</p>
              <p className="text-sm text-slate-600">Available for payout</p>
            </div>
            <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  disabled={!canRequestPayout}
                  data-testid="btn_request_payout"
                >
                  Request Payout
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Request Payout</DialogTitle>
                  <DialogDescription>
                    Request a payout from your available balance. Minimum amount is $100.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="100.00"
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      min="100"
                      max={currentBalance}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Preferred Methods</Label>
                    <div className="space-y-2">
                      {["IBAN", "PayPal", "BTC", "ETH", "USDT"].map((method) => (
                        <div key={method} className="flex items-center space-x-2">
                          <Switch
                            id={method}
                            checked={selectedMethods.includes(method)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedMethods([...selectedMethods, method]);
                              } else {
                                setSelectedMethods(selectedMethods.filter(m => m !== method));
                              }
                            }}
                          />
                          <Label htmlFor={method}>{method}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="note">Note (Optional)</Label>
                    <Textarea
                      id="note"
                      placeholder="Add a note for this payout request..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsRequestModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleRequestPayout}
                      disabled={isSubmitting || !payoutAmount || parseFloat(payoutAmount) < 100}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {!canRequestPayout && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Minimum payout amount is $100. You need ${(100 - currentBalance).toFixed(2)} more to request a payout.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5" />
                Payout History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table data-testid="tbl_payout_history">
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emptyPayoutHistory.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>{payout.date}</TableCell>
                      <TableCell className="font-medium">${payout.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(payout.status)}
                          {getStatusBadge(payout.status)}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{payout.ref}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Manage your payout methods. You can have multiple methods configured.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" data-testid="form_payout_methods">
                {emptyPayoutMethods.map((method) => (
                  <div key={method.id} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium">{method.type}</p>
                          <p className="text-sm text-slate-600">{method.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {method.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                        <Button variant="outline" size="sm">
                          <Settings className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add New Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </RequireAuth>
  );
}
