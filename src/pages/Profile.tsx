import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Camera, Mail, UserStar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/lib/api/useUser";

export type User = {
  profileImageUrl: string | null;
  fullName: string;
  role: string;
  email: string;
};

export const Profile: React.FC = React.memo(() => {
  const { data: currentUser } = useCurrentUser();
  const navigate = useNavigate();
  const newCurrentUser = currentUser?.data;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-gray-200 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <Card>
          <CardContent className="pt-10 pb-10 flex flex-col items-center space-y-6">
            {/* Profile Avatar */}
            <div className="relative">
              {newCurrentUser ? (
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={newCurrentUser.profileImage ?? undefined}
                    alt={newCurrentUser.fullName}
                  />
                  <AvatarFallback className="text-2xl">
                    {newCurrentUser.fullName?.charAt(0) ?? "N/A"}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse border-4 border-white shadow-lg"></div>
              )}

              {newCurrentUser && (
                <div className="absolute bottom-0 right-0 bg-primary rounded-full p-2 shadow-md">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="text-center space-y-2 w-full max-w-md">
              {newCurrentUser ? (
                <h1 className="text-3xl font-bold text-gray-900">
                  {newCurrentUser.fullName}
                </h1>
              ) : (
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto"></div>
              )}
            </div>

            <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 mt-6">
              {newCurrentUser ? (
                <>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{newCurrentUser.email}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <UserStar className="w-4 h-4" />
                    <span>{newCurrentUser.role}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

Profile.displayName = "Profile";
