"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DollarSign, Save, Lock, Globe, Monitor } from "lucide-react";

// Mock data
const mockPricingData = [
  {
    id: 1,
    publisher: "CryptoNews",
    placement: "Header Banner",
    size: "728x90",
    country: "US",
    cpm: 2.50,
    isLocked: false,
  },
  {
    id: 2,
    publisher: "CoinDesk",
    placement: "Sidebar",
    size: "300x250",
    country: "US",
    cpm: 3.20,
    isLocked: true,
  },
  {
    id: 3,
    publisher: "Decrypt",
    placement: "Footer",
    size: "728x90",
    country: "CA",
    cpm: 2.80,
    isLocked: false,
  },
  {
    id: 4,
    publisher: "CoinTelegraph",
    placement: "In-Article",
    size: "300x250",
    country: "GB",
    cpm: 3.50,
    isLocked: true,
  },
];

export const metadata = {
  title: "Pricing Gate - CoinAds Admin",
  description: "Manage CPM pricing for publisher placements",
};

export default function AdminPricingPage() {
  const [pricingData, setPricingData] = useState(mockPricingData);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [message, setMessage] = useState("");

  const handleEditStart = (id: number, currentCpm: number) => {
    setEditingRow(id);
    setEditValue(currentCpm.toString());
  };

  const handleEditCancel = () => {
    setEditingRow(null);
    setEditValue("");
  };

  const handleEditSave = async (id: number) => {
    const newCpm = parseFloat(editValue);
    
    if (isNaN(newCpm) || newCpm < 0) {
      setMessage("Please enter a valid CPM value");
      return;
    }

    try {
      // TODO: Implement PUT /api/admin/pricing/:placementId
      const response = await fetch(`/api/admin/pricing/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpm: newCpm }),
      });

      if (response.ok) {
        setPricingData(prev => 
          prev.map(item => 
            item.id === id ? { ...item, cpm: newCpm } : item
          )
        );
        setEditingRow(null);
        setEditValue("");
        setMessage("CPM updated successfully");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to update CPM. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      US: "🇺🇸",
      CA: "🇨🇦",
      GB: "🇬🇧",
      DE: "🇩🇪",
      FR: "🇫🇷",
    };
    return flags[country] || "🌍";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader 
        title="Pricing Gate" 
        description="Manage CPM pricing for publisher placements"
      />

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Placement Pricing
          </CardTitle>
          <CardDescription>
            Edit CPM rates for different placements. Locked items are set by admin and cannot be modified.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Publisher</TableHead>
                <TableHead>Placement</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>CPM</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricingData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                        <Monitor className="h-4 w-4 text-slate-600" />
                      </div>
                      <span className="font-medium">{item.publisher}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.placement}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.size}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{getCountryFlag(item.country)}</span>
                      <span>{item.country}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingRow === item.id ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-20"
                          step="0.01"
                          min="0"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleEditSave(item.id)}
                          data-testid={`btn_save_cpm_row_${item.id}`}
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEditCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">${item.cpm.toFixed(2)}</span>
                        {item.isLocked && (
                          <Lock className="h-3 w-3 text-slate-400" title="Admin-set" />
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {!item.isLocked ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditStart(item.id, item.cpm)}
                      >
                        Edit
                      </Button>
                    ) : (
                      <div className="flex items-center space-x-1 text-slate-500">
                        <Lock className="h-3 w-3" />
                        <span className="text-xs">Admin-set</span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-slate-600">Average CPM</p>
                <p className="text-lg font-semibold">
                  ${(pricingData.reduce((sum, item) => sum + item.cpm, 0) / pricingData.length).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-slate-600">Total Placements</p>
                <p className="text-lg font-semibold">{pricingData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-slate-600">Locked Items</p>
                <p className="text-lg font-semibold">
                  {pricingData.filter(item => item.isLocked).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
