"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Globe } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";

const categories = [
  { value: "news", label: "News & Media" },
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance & Crypto" },
  { value: "entertainment", label: "Entertainment" },
  { value: "education", label: "Education" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "business", label: "Business" },
  { value: "other", label: "Other" },
];

export default function CreateSitePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    domain: "",
    name: "",
    description: "",
    category: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/publisher/sites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create site");
      }

      router.push(`/app/publisher/sites/${data.site.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create site");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateDomain = (domain: string) => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const isValidForm = formData.domain && formData.name && validateDomain(formData.domain);

  return (
    <RequireAuth>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Site</h1>
            <p className="text-muted-foreground">
              Register a new website to start earning
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Site Information</span>
          </CardTitle>
          <CardDescription>
            Provide details about your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain *</Label>
                <Input
                  id="domain"
                  type="text"
                  required
                  value={formData.domain}
                  onChange={(e) => handleInputChange("domain", e.target.value)}
                  placeholder="example.com"
                />
                <p className="text-xs text-muted-foreground">
                  Enter your website domain without http:// or https://
                </p>
                {formData.domain && !validateDomain(formData.domain) && (
                  <p className="text-xs text-red-600">
                    Please enter a valid domain name
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Site Name *</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="My Awesome Website"
                />
                <p className="text-xs text-muted-foreground">
                  A friendly name for your website
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your website content and audience..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Help advertisers understand your site better
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose the category that best describes your website
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || !isValidForm}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Site...
                  </>
                ) : (
                  "Create Site"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>What happens next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">1</span>
              </div>
              <div>
                <h4 className="font-medium">Site Registration</h4>
                <p className="text-sm text-muted-foreground">
                  Your site will be registered and a verification token will be generated.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">2</span>
              </div>
              <div>
                <h4 className="font-medium">Verification</h4>
                <p className="text-sm text-muted-foreground">
                  Add the verification token to your website's HTML head section.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">3</span>
              </div>
              <div>
                <h4 className="font-medium">Approval</h4>
                <p className="text-sm text-muted-foreground">
                  Once verified, your site will be reviewed and approved for ad serving.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">4</span>
              </div>
              <div>
                <h4 className="font-medium">Start Earning</h4>
                <p className="text-sm text-muted-foreground">
                  Create ad placements and start earning from your website traffic.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </RequireAuth>
  );
}
