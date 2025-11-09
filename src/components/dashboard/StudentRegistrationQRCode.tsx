import React from "react";
import { useGetStudentRegistrationQRCode } from "@/lib/api/useQRCode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, QrCode, Link2, Download, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface StudentRegistrationQRCodeProps {
  data?: {
    message: string;
    qrCodeDataUrl: string;
    url: string;
  };
}

const StudentRegistrationQRCode: React.FC<StudentRegistrationQRCodeProps> = ({ data: propData }) => {
  const { 
    data: fetchedData, 
    isLoading, 
    error, 
    refetch,
    isRefetching 
  } = useGetStudentRegistrationQRCode();

  // Use prop data if provided, otherwise use fetched data
  const data = propData || fetchedData;

  const handleRefresh = () => {
    refetch();
    toast.info("Refreshing student registration QR code...");
  };

  const handleDownload = () => {
    if (!data?.qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.href = data.qrCodeDataUrl;
    link.download = `student-registration-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Student registration QR code downloaded successfully!");
  };

  const copyUrlToClipboard = async () => {
    if (!data?.url) return;

    try {
      await navigator.clipboard.writeText(data.url);
      toast.success("Student registration URL copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy URL to clipboard");
    }
  };


  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <p className="text-sm text-gray-600">Generating registration QR code...</p>
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
            Error Loading Registration QR Code
          </CardTitle>
          <CardDescription className="text-red-500">
            {error.message || "Failed to generate registration QR code"}
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
            <UserPlus className="h-5 w-5 mr-2 text-purple-600" />
            Student Registration QR
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
          Print this QR code for new students to self-register. Students scan and fill their details to create account.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* QR Code Image */}
        <div className="flex justify-center">
          <div className="p-4 bg-white border-2 border-purple-200 rounded-lg">
            <img
              src={data.qrCodeDataUrl}
              alt="Student Registration QR Code"
              className="w-48 h-48 object-contain"
            />
          </div>
        </div>

        {/* QR Code Details */}
        <div className="space-y-3">
          
          {/* Instructions */}
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-700 font-medium mb-1">📝 Self-Registration Instructions:</p>
            <ol className="text-xs text-purple-600 space-y-1">
              <li>1. Download and print this QR code</li>
              <li>2. Display at reception or entrance</li>
              <li>3. New students scan with phone camera</li>
              <li>4. Students fill registration form</li>
              <li>5. Account created with default password</li>
              <li>6. Admin can verify and approve later</li>
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


export default StudentRegistrationQRCode;
