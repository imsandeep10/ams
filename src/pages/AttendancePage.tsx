import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Loader2, Calendar, Clock, User, Phone, MapPin, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useMarkAttendance } from "@/lib/api/useQRCode";

interface AttendanceStatus {
  success: boolean;
  message: string;
  studentName?: string;
  date?: string;
  time?: string;
  alreadyMarked?: boolean;
  error?: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
}

const AttendancePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<AttendanceStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  // Track whether we've already attempted to get location automatically
  const hasTriedLocationRef = useRef(false);
  // Throttle showing location error toasts (ms)
  const lastLocationToastRef = useRef<number | null>(null);
  
  const token = searchParams.get('token');
  const markAttendanceMutation = useMarkAttendance();
  const isStaticQR = !token; // Static QR if no token parameter

  // Validate token on component mount (skip for static QR)
  useEffect(() => {
    const validateToken = async () => {
      // For static QR codes (no token), skip validation
      if (isStaticQR) {
        setTokenValid(true);
        setIsValidatingToken(false);
        return;
      }

      if (!token) {
        setStatus({
          success: false,
          message: "Invalid QR code. No attendance token found."
        });
        setTokenValid(false);
        setIsValidatingToken(false);
        return;
      }

      try {
        // Try to decode the token to check if it's valid and for today
        const payload = JSON.parse(atob(token.split('.')[1]));
        const today = new Date().toISOString().split('T')[0];
        
        if (payload.date !== today) {
          setStatus({
            success: false,
            message: "QR code has expired. This QR code is not for today."
          });
          setTokenValid(false);
        } else if (payload.exp * 1000 < Date.now()) {
          setStatus({
            success: false,
            message: "QR code has expired. Please get a new QR code."
          });
          setTokenValid(false);
        } else {
          setTokenValid(true);
        }
      } catch (error) {
        setStatus({
          success: false,
          message: "Invalid QR code token format."
        });
        setTokenValid(false);
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [token, isStaticQR]);

  // Get user location when component mounts and token is valid
  useEffect(() => {
    // Only auto-attempt location once and only if there isn't an existing error
    if (
      tokenValid &&
      !location &&
      !isGettingLocation &&
      !hasTriedLocationRef.current &&
      !locationError
    ) {
      getCurrentLocation();
    }
  }, [tokenValid, location, isGettingLocation, locationError]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      const msg = "Geolocation is not supported by this browser.";
      setLocationError(msg);
      // throttle toast
      const now = Date.now();
      if (!lastLocationToastRef.current || now - lastLocationToastRef.current > 10000) {
        lastLocationToastRef.current = now;
        toast.error(msg);
      }
      return;
    }
    // mark that we've attempted to get location automatically
    hasTriedLocationRef.current = true;
    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsGettingLocation(false);
        toast.success("Location detected successfully!");
      },
      (error) => {
        let errorMessage = "Unable to get your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please allow location access and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable. Please try again.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
        }
        setLocationError(errorMessage);
        setIsGettingLocation(false);
        // throttle error toasts to once per 10 seconds
        const now = Date.now();
        if (!lastLocationToastRef.current || now - lastLocationToastRef.current > 10000) {
          lastLocationToastRef.current = now;
          toast.error(errorMessage);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleSubmitPhoneNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!location) {
      toast.error("Location is required for attendance. Please allow location access.");
      return;
    }

    // For dynamic QR codes, token is required
    if (!isStaticQR && !token) {
      toast.error("Invalid QR code token");
      return;
    }

    setIsLoading(true);

    try {
      // Call the attendance marking API using the hook
      const requestData: any = { 
        phoneNumber: phoneNumber.trim(),
        location
      };
      
      // Add token only for dynamic QR codes
      if (!isStaticQR && token) {
        requestData.token = token;
      }
      
      const data = await markAttendanceMutation.mutateAsync(requestData);
      
      if (data.success) {
        // Use local time for consistent display
        const now = new Date();
        const localDate = now.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        const localTime = now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          hour12: true 
        });
        
        setStatus({
          success: true,
          message: data.alreadyMarked 
            ? "You have already marked attendance for today" 
            : "You are attended today",
          studentName: data.studentName,
          date: localDate,
          time: localTime,
          alreadyMarked: data.alreadyMarked
        });

        if (!data.alreadyMarked) {
          toast.success("Attendance marked successfully!");
        } else {
          toast.info("Attendance already marked for today");
        }
      } else {
        setStatus({
          success: false,
          message: data.message || "Failed to mark attendance",
          error: data.error
        });
        toast.error(data.message || "Failed to mark attendance");
      }

    } catch (error: any) {
      
      let errorMessage = "Failed to mark attendance";
      
      if (error.response?.status === 404) {
        errorMessage = "Student does not exist. Please check your phone number.";
      } else if (error.response?.status === 401) {
        errorMessage = "QR code has expired. Please get a new QR code.";
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || "Invalid attendance request";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setStatus({
        success: false,
        message: errorMessage
      });

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/attendance');
  };

  const handleTryAgain = () => {
    setStatus(null);
    setPhoneNumber("");
    setLocation(null);
    setLocationError(null);
    // allow another automatic attempt and clear previous toast timestamp so user will see the toast again if it fails
    hasTriedLocationRef.current = false;
    lastLocationToastRef.current = null;
    // Automatically try to get location again
    getCurrentLocation();
  };

  if (isValidatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              {isStaticQR ? 'Loading Attendance Page...' : 'Validating QR Code...'}
            </h2>
            <p className="text-gray-600 text-center">
              {isStaticQR ? 'Please wait while we prepare the attendance form' : 'Please wait while we validate your QR code'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md border-red-200">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-700">
              Invalid QR Code
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-lg font-medium text-red-600">
                {status?.message}
              </p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 text-center">
                Please scan a new QR code from your instructor.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md border-green-200">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">
              Attendance Confirmed!
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-lg font-medium text-green-600">
                {status.message}
              </p>
            </div>

            <div className="space-y-3 bg-green-50 p-4 rounded-lg">
              {status.studentName && (
                <div className="flex items-center text-sm text-green-700">
                  <User className="h-4 w-4 mr-2" />
                  <span className="font-medium">Student:</span>
                  <span className="ml-1">{status.studentName}</span>
                </div>
              )}
              
              <div className="flex items-center text-sm text-green-700">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="font-medium">Date:</span>
                <span className="ml-1">{status.date}</span>
              </div>
              
              <div className="flex items-center text-sm text-green-700">
                <Clock className="h-4 w-4 mr-2" />
                <span className="font-medium">Time:</span>
                <span className="ml-1">{status.time}</span>
              </div>

              {status.alreadyMarked && (
                <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                  <strong>Note:</strong> Your attendance was already recorded earlier today.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status && !status.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md border-red-200">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-700">
              Attendance Failed
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-lg font-medium text-red-600">
                {status.message}
              </p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 text-center">
                Please check your phone number and try again, or contact your instructor if this problem persists.
              </p>
            </div>

            <div>
              <Link to="/register/newstudent" className="text-blue-600 hover:underline text-center">Register as Student</Link>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleTryAgain}
                className="flex-1"
                variant="outline"
              >
                Try Again
              </Button>
              <Button 
                onClick={handleGoBack}
                className="flex-1"
                variant="outline"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show phone number input form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center">
            <Phone className="h-6 w-6 mr-2 text-blue-600" />
            Mark Attendance {isStaticQR}
          </CardTitle>
          <p className="text-gray-600 text-sm mt-2">
            {isStaticQR 
              ? 'Enter your phone number and allow location access to mark attendance'
              : 'Please enter your phone number to confirm your attendance'
            }
          </p>
        </CardHeader>

        <CardContent>
          {/* Location Status */}
          <div className="mb-6">
            {isGettingLocation && (
              <div className="flex items-center justify-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Loader2 className="h-4 w-4 mr-2 animate-spin text-blue-600" />
                <span className="text-sm text-blue-700">Getting your location...</span>
              </div>
            )}
            
            {location && !isGettingLocation && (
              <div className="flex items-center justify-center p-3 bg-green-50 rounded-lg border border-green-200">
                <MapPin className="h-4 w-4 mr-2 text-green-600" />
                <span className="text-sm text-green-700">Location detected successfully</span>
              </div>
            )}
            
            {locationError && (
              <div className="space-y-3">
                <div className="flex items-center justify-center p-3 bg-red-50 rounded-lg border border-red-200">
                  <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                  <span className="text-sm text-red-700">{locationError}</span>
                </div>
                <Button
                  onClick={getCurrentLocation}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={isGettingLocation}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmitPhoneNumber} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full"
                disabled={isLoading}
                required
              />
              <p className="text-xs text-gray-500">
                Enter the phone number you registered with
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || !phoneNumber.trim() || !location || isGettingLocation}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Marking Attendance...
                </>
              ) : !location ? (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Location Required
                </>
              ) : (
                'Confirm Attendance'
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGoBack}
                className="text-gray-500"
              >
                Cancel
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500 border-t pt-4 space-y-1">
            <p>
              Your attendance will be marked for today ({new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })})
            </p>
            <p className="text-amber-600">
              ⚠️ You must be within 100 meters of the office location
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;