import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetAdminById } from "@/lib/api/useAdmin";
import { ArrowLeft, Camera, Mail, MapPin, Phone } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export const AdminProfile = React.memo(() => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: admin, isLoading, error } = useGetAdminById(id || "");

  const adminData = admin
    ? {
        fullName: admin.fullName || "N/A",
        email: admin.email || "N/A",
        phoneNumber: admin.phoneNumber || "N/A",
        profileImage: admin.profileImage?.url || "profile.svg",
        address: admin.address || "N/A",
        role: admin.role || "N/A",
      }
    : null;

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin profile...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600">Error loading admin data</p>
          </CardContent>
        </Card>
      </div>
    );

  if (!adminData)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">No admin data found</p>
          </CardContent>
        </Card>
      </div>
    );

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-gray-200 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center gap-6">
                {/* Profile Avatar */}
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage
                      src={adminData.profileImage}
                      alt={adminData.fullName}
                    />
                    <AvatarFallback className="text-2xl">
                      {getInitials(adminData.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 bg-primary rounded-full p-2 shadow-md">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {adminData.fullName}
                  </h1>
                </div>

                <div className="flex-1 space-y-3 text-center md:text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="break-all">
                        Email: {adminData.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Address: {adminData.address}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Phone className="w-4 h-4" />
                      <span>Contact Number: {adminData.phoneNumber}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="font-medium">Role:</span>
                      <span>{adminData.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
});

AdminProfile.displayName = "AdminProfile";
