"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Download, CheckCircle, AlertTriangle, Globe, FileText } from "lucide-react";

// Mock data
const mockSiteData = {
  id: "1",
  domain: "example.com",
  status: "pending",
  metaTag: "coinads-verification-123456789",
  verificationFile: "coinads-verification.txt",
};

// Metadata removed - client component cannot export metadata

export default function SiteVerificationPage() {
  const params = useParams();
  const siteId = params.id as string;
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(mockSiteData.status);
  const [message, setMessage] = useState("");

  const handleCopyMetaTag = async () => {
    try {
      await navigator.clipboard.writeText(`<meta name="coinads-verification" content="${mockSiteData.metaTag}" />`);
      setMessage("Meta tag copied to clipboard!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to copy meta tag");
    }
  };

  const handleDownloadFile = () => {
    // Create and download the verification file
    const content = mockSiteData.metaTag;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mockSiteData.verificationFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setMessage("");
    
    try {
      // TODO: Implement POST /api/publisher/sites/:id/verify
      const response = await fetch(`/api/publisher/sites/${siteId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        const result = await response.json();
        setVerificationStatus(result.status);
        setMessage("Domain verification completed!");
      } else {
        setMessage("Verification failed. Please check your implementation and try again.");
      }
    } catch (error) {
      setMessage("An error occurred during verification. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "pending":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "failed":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader 
        title="Verify Domain" 
        description={`Verify ownership of ${mockSiteData.domain}`}
      />

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusIcon(verificationStatus)}
              <span className="ml-2">Verification Status</span>
            </div>
            {getStatusBadge(verificationStatus)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Domain</p>
              <p className="font-medium">{mockSiteData.domain}</p>
            </div>
            <Button 
              onClick={handleVerify}
              disabled={isVerifying || verificationStatus === "verified"}
              data-testid="btn_verify_now"
            >
              {isVerifying ? "Verifying..." : "Verify Now"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Verification Methods */}
      <Tabs defaultValue="meta" className="space-y-4">
        <TabsList>
          <TabsTrigger value="meta">Meta Tag</TabsTrigger>
          <TabsTrigger value="file">File Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="meta" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Meta Tag Verification
              </CardTitle>
              <CardDescription>
                Add this meta tag to your website's &lt;head&gt; section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <code className="text-sm font-mono">
                  &lt;meta name="coinads-verification" content="{mockSiteData.metaTag}" /&gt;
                </code>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Instructions:</h4>
                <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
                  <li>Copy the meta tag above</li>
                  <li>Add it to the &lt;head&gt; section of your website</li>
                  <li>Make sure it's on the homepage (root domain)</li>
                  <li>Click "Verify Now" to check</li>
                </ol>
              </div>
              
              <Button 
                onClick={handleCopyMetaTag}
                variant="outline"
                data-testid="btn_copy_meta"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Meta Tag
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="file" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                File Upload Verification
              </CardTitle>
              <CardDescription>
                Upload a verification file to your website's root directory
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">File: {mockSiteData.verificationFile}</p>
                    <p className="text-sm text-slate-600">Content: {mockSiteData.metaTag}</p>
                  </div>
                  <Button 
                    onClick={handleDownloadFile}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Instructions:</h4>
                <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
                  <li>Download the verification file</li>
                  <li>Upload it to your website's root directory</li>
                  <li>Make sure it's accessible at: {mockSiteData.domain}/{mockSiteData.verificationFile}</li>
                  <li>Click "Verify Now" to check</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-slate-600">
            <p>• Make sure your website is accessible and the verification method is properly implemented</p>
            <p>• Verification may take a few minutes to process</p>
            <p>• If verification fails, check that the meta tag or file is correctly placed</p>
            <p>• Contact support if you continue to have issues</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
