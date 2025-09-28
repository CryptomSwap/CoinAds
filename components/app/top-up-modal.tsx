"use client";

import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Copy,
  ExternalLink,
  ChevronUp,
  ChevronDown
} from "lucide-react";

interface TopUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TopUpModal({ open, onOpenChange }: TopUpModalProps) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // For continuous increment functionality
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTopUp = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setStep(3);
    }, 2000);
  };

  const handleClose = () => {
    setStep(1);
    setAmount("");
    setMethod("card");
    setIsProcessing(false);
    setIsSuccess(false);
    // Clear any ongoing intervals
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onOpenChange(false);
  };

  const updateAmount = useCallback((newAmount: number) => {
    const clampedAmount = Math.max(0, Math.min(10000, newAmount));
    setAmount(clampedAmount.toString());
  }, []);

  const incrementAmount = useCallback(() => {
    const currentAmount = parseFloat(amount) || 0;
    updateAmount(currentAmount + 50);
  }, [amount, updateAmount]);

  const decrementAmount = useCallback(() => {
    const currentAmount = parseFloat(amount) || 0;
    updateAmount(currentAmount - 50);
  }, [amount, updateAmount]);

  const startContinuousIncrement = useCallback((isIncrement: boolean) => {
    console.log('startContinuousIncrement called with:', isIncrement);
    
    // Clear any existing timeouts/intervals first
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Initial increment/decrement
    if (isIncrement) {
      console.log('Initial increment');
      incrementAmount();
    } else {
      console.log('Initial decrement');
      decrementAmount();
    }

    // Start continuous increment after 800ms
    console.log('Setting timeout for continuous mode');
    timeoutRef.current = setTimeout(() => {
      console.log('Starting continuous mode');
      let interval = 500; // Start with 500ms interval
      
      const continuousUpdate = () => {
        console.log('Continuous update:', isIncrement ? 'increment' : 'decrement');
        if (isIncrement) {
          incrementAmount();
        } else {
          decrementAmount();
        }
        
        // Accelerate the interval (minimum 50ms)
        interval = Math.max(50, interval * 0.9);
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        
        intervalRef.current = setTimeout(continuousUpdate, interval);
      };
      
      intervalRef.current = setTimeout(continuousUpdate, interval);
    }, 800);
  }, [incrementAmount, decrementAmount]);

  const stopContinuousIncrement = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const calculateFees = () => {
    const numAmount = parseFloat(amount) || 0;
    if (method === "card") return numAmount * 0.029 + 0.30; // 2.9% + $0.30
    if (method === "crypto") return 0; // No fees for crypto
    return 0;
  };

  const totalAmount = (parseFloat(amount) || 0) + calculateFees();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Credits to Wallet</DialogTitle>
          <DialogDescription>
            Choose your amount and payment method to add funds
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            {/* Amount Input */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Enter Amount</h3>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <div className="absolute right-0 top-0 h-full w-8 flex flex-col">
                  <div
                    className="flex-1 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-tr-md"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      console.log('Mouse down - increment');
                      startContinuousIncrement(true);
                    }}
                    onMouseUp={(e) => {
                      e.preventDefault();
                      console.log('Mouse up - stop');
                      stopContinuousIncrement();
                    }}
                    onMouseLeave={(e) => {
                      e.preventDefault();
                      console.log('Mouse leave - stop');
                      stopContinuousIncrement();
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      console.log('Touch start - increment');
                      startContinuousIncrement(true);
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      console.log('Touch end - stop');
                      stopContinuousIncrement();
                    }}
                  >
                    <ChevronUp className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div
                    className="flex-1 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-br-md"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      console.log('Mouse down - decrement');
                      startContinuousIncrement(false);
                    }}
                    onMouseUp={(e) => {
                      e.preventDefault();
                      console.log('Mouse up - stop');
                      stopContinuousIncrement();
                    }}
                    onMouseLeave={(e) => {
                      e.preventDefault();
                      console.log('Mouse leave - stop');
                      stopContinuousIncrement();
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      console.log('Touch start - decrement');
                      startContinuousIncrement(false);
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      console.log('Touch end - stop');
                      stopContinuousIncrement();
                    }}
                  >
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
                <Input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-8 pr-8 text-lg h-12 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              <Tabs value={method} onValueChange={setMethod}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="card">Credit Card</TabsTrigger>
                  <TabsTrigger value="crypto">Crypto</TabsTrigger>
                </TabsList>
                
                <TabsContent value="card" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Card ending in 4242
                        </div>
                        <div className="text-sm">
                          <strong>Fee:</strong> 2.9% + $0.30
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="crypto" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Powered by Coinbase Commerce
                        </div>
                        <div className="text-sm">
                          <strong>Fee:</strong> No additional fees
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Summary */}
            {amount && parseFloat(amount) > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>{formatAmount(parseFloat(amount) || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fee:</span>
                      <span>{formatAmount(calculateFees())}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>{formatAmount(totalAmount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={() => setStep(2)} 
                disabled={!amount || parseFloat(amount) <= 0}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Confirm Payment</h3>
              <p className="text-muted-foreground">
                Review your order details before proceeding
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>{formatAmount(parseFloat(amount) || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span>
                      {method === "card" && "Credit Card"}
                      {method === "crypto" && "Crypto"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee:</span>
                    <span>{formatAmount(calculateFees())}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{formatAmount(totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {method === "crypto" && (
              <Card>
                <CardHeader>
                  <CardTitle>Crypto Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">
                      Bitcoin Address:
                    </div>
                    <div className="font-mono text-sm break-all">
                      bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => {
                        navigator.clipboard.writeText(bitcoinAddress);
                        // TODO: Add toast notification
                        console.log('Bitcoin address copied to clipboard');
                      }}
                      data-testid="copy-bitcoin-address"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Address
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Send exactly {formatAmount(totalAmount)} worth of Bitcoin to this address.
                    Payment will be confirmed after 3 network confirmations.
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleTopUp} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ${formatAmount(totalAmount)}`
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && isSuccess && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
              <p className="text-muted-foreground">
                {formatAmount(parseFloat(amount) || 0)} has been added to your wallet
              </p>
            </div>
            
            <div className="flex justify-center space-x-2">
              <Button variant="outline" onClick={handleClose}>
                View Wallet
              </Button>
              <Button onClick={handleClose}>
                Create Campaign
              </Button>
            </div>
          </div>
        )}

        {/* Demo Mode Banner */}
        <div className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            Demo mode: All payments are simulated for testing purposes
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
