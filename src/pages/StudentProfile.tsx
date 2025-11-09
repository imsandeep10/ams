import React from "react";
import {
  ArrowLeft,
  Camera,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Globe,
  Languages,
  BookOpen,
  Clock,
  Target,
  Calendar,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useGetStudentById } from "@/lib/api/useStudents";

export const StudentProfile = React.memo(() => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: student, isLoading, error } = useGetStudentById(id || "");

  const studentData = student
    ? {
        fullName: student.user?.fullName || "N/A",
        email: student.user?.email || "N/A",
        contactNumber: student.user?.phoneNumber || "N/A",
        academicQualification: student.academicQualification || "N/A",
        yearOfCompletion: student.yearOfCompletion || "N/A",
        countryWishToApply: student.preferredCountry || "N/A",
        language: student.language || "N/A",
        faculty: student.faculty || "N/A",
        classTime: student.classTime || "N/A",
        gpaPercentage: student.gpaOrPercentage || "N/A",
        interestedCourse: student.interestedCourse || "N/A",
        profileImage: student.user?.profileImage?.url || "profile.svg",
        address: student.user?.address || "N/A",
      }
    : null;

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student profile...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600">Error loading student data</p>
          </CardContent>
        </Card>
      </div>
    );

  if (!studentData)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">No student data found</p>
          </CardContent>
        </Card>
      </div>
    );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen  p-4 md:p-6 lg:p-8">
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
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage
                      src={studentData.profileImage}
                      alt={studentData.fullName}
                    />
                    <AvatarFallback className="text-2xl">
                      {getInitials(studentData.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 bg-primary rounded-full p-2 shadow-md">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-3">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {studentData.fullName}
                    </h1>
                    <Badge variant="secondary" className="mt-2 text-white">
                      <GraduationCap className="w-4 h-4 mr-1" />
                      {studentData.academicQualification}
                    </Badge>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="break-all">{studentData.email}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{studentData.contactNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{studentData.address}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Academic Qualification
                  </label>
                  <p className="text-gray-900 font-medium">
                    {studentData.academicQualification}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Year of Completion
                  </label>
                  <p className="text-gray-900 font-medium">
                    {studentData.yearOfCompletion}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    GPA/Percentage
                  </label>
                  <p className="text-gray-900 font-medium">
                    {studentData.gpaPercentage}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Faculty
                  </label>
                  <p className="text-gray-900 font-medium">
                    {studentData.faculty}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Interested Course
                  </label>
                  <p className="text-gray-900 font-medium">
                    {studentData.interestedCourse}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Class Time
                  </label>
                  <p className="text-gray-900 font-medium">
                    {studentData.classTime}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Study Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Study Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Preferred Country
                  </label>
                  <p className="text-gray-900 font-medium">
                    {studentData.countryWishToApply}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    Language
                  </label>
                  <p className="text-gray-900 font-medium">
                    {studentData.language}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
});

StudentProfile.displayName = "StudentProfile";
