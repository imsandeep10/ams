import React from "react";
import { useGetMockTestRegistrationQRCode } from "@/lib/api/useQRCode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, QrCode, Link2, Download, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";

interface MockTestRegistrationQRCodeProps {
  data?: {
    message: string;
    qrCodeDataUrl: string;
    url: string;
  };
}

const MockTestRegistrationQRCode: React.FC<MockTestRegistrationQRCodeProps> = ({ data: propData }) => {
  const { 
    data: fetchedData, 
    isLoading, 
    error, 
    refetch,
    isRefetching 
  } = useGetMockTestRegistrationQRCode();

  // Use prop data if provided, otherwise use fetched data
  const data = propData || fetchedData;

  const handleRefresh = () => {
    refetch();
    toast.info("Refreshing mock test registration QR code...");
  };

  const handleDownload = () => {
    if (!data?.qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.href = data.qrCodeDataUrl;
    link.download = `mock-test-registration-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Mock test QR code downloaded successfully!");
  };

  const copyUrlToClipboard = async () => {
    if (!data?.url) return;

    try {
      await navigator.clipboard.writeText(data.url);
      toast.success("Mock test registration URL copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy URL to clipboard");
    }
  };


  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">Generating mock test QR code...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center">
            <QrCode className="h-5 w-5 mr-2" />
            Error Loading Mock Test QR Code
          </CardTitle>
          <CardDescription className="text-red-500">
            {error.message || "Failed to generate mock test QR code"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleRefresh} 
            className="w-full"
            variant="outline"
            disabled={isRefetching}
          >
            {isRefetching ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <p className="text-gray-500">No QR code data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <ClipboardCheck className="h-5 w-5 mr-2 text-blue-600" />
            Mock Test Registration QR
          </div>
          <Button
            onClick={handleRefresh}
            size="sm"
            variant="ghost"
            disabled={isRefetching}
          >
            {isRefetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
        <CardDescription>
          Print this QR code for IELTS mock test registration. Students can register only on Thursdays for upcoming tests.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* QR Code Image */}
        <div className="flex justify-center">
          <div className="p-4 bg-white border-2 border-blue-200 rounded-lg">
            <img
              src={data.qrCodeDataUrl}
              alt="Mock Test Registration QR Code"
              className="w-48 h-48 object-contain"
            />
          </div>
        </div>

        {/* QR Code Details */}
        <div className="space-y-3">
          
          {/* Instructions */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 font-medium mb-1">📋 Mock Test Registration Rules:</p>
            <ol className="text-xs text-blue-600 space-y-1">
              <li>✓ Registration only allowed on Thursdays</li>
              <li>✓ Mock tests scheduled on Thursdays only</li>
              <li>✓ Choose from 3 time slots available</li>
              <li>✓ Academic or General Training IELTS</li>
              <li>✓ WhatsApp number required (10 digits)</li>
              <li>✓ One registration per phone number</li>
            </ol>
          </div>

          <div className="text-xs text-gray-500 break-all">
            <strong>Registration URL:</strong> {data.url}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={copyUrlToClipboard}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Link2 className="h-4 w-4 mr-1" />
            Copy URL
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-1" />
            Print QR
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


export default MockTestRegistrationQRCode;
