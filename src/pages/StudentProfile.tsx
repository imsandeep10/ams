import React from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Info,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useGetStudentById } from "@/lib/api/useStudents";
import { IoEarth } from "react-icons/io5";
import { LiaMoneyBillWaveAltSolid } from "react-icons/lia";
import RemarkCard from "@/components/remarks/remarkCard";

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
      <div className="w-full mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-gray-200 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 flex flex-col gap-6">
            <Card className="rounded-md border border-gray-300 shadow-xs">
              <CardContent className="gap-4 flex flex-col">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Avatar className="bg-green-50 rounded-full w-40 h-40 aspect-square ">
                    <AvatarImage src={studentData.profileImage} />
                    <AvatarFallback className="text-4xl font-medium">
                      {getInitials(studentData.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mt-2">
                    <h3 className="text-2xl font-medium text-center">
                      {studentData.fullName}
                    </h3>
                    <p className="text-muted-foreground text-center font-medium">
                      {studentData.academicQualification}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Mail />
                  <p>{studentData.email}</p>
                </div>
                <div className="flex gap-2">
                  <Phone />
                  <p>{studentData.contactNumber}</p>
                </div>
                <div className="flex gap-2">
                  <MapPin />
                  <p>{studentData.address}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-md border border-gray-300 shadow-xs gap-4">
              <CardHeader className="flex gap-2 items-center">
                <IoEarth size={24} className="text-primary" />
                <CardTitle className="text-xl font-medium">
                  Study Preference
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="grid grid-cols-[2fr_1fr] gap-2">
                  <p className="text-muted-foreground font-medium">
                    Preferred Country:
                  </p>
                  <p className="font-medium">
                    {studentData.countryWishToApply}
                  </p>
                </div>
                <div className="grid grid-cols-[2fr_1fr] gap-2">
                  <p className="text-muted-foreground font-medium">
                    Language Proficiency:
                  </p>
                  <p className="font-medium">{studentData.language}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-2 flex flex-col gap-6">
            <Card className="rounded-md border border-gray-300 shadow-xs">
              <CardHeader className="flex gap-2 items-center">
                <GraduationCap className="text-blue-500" size={28} />
                <CardTitle className="text-xl font-medium">
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-x-2 gap-y-6">
                <div className="flex flex-col">
                  <p className="text-muted-foreground font-medium">
                    Academic Qualification:
                  </p>
                  <p className="font-medium">
                    {studentData.academicQualification}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-muted-foreground font-medium">
                    Year of Completion:
                  </p>
                  <p className="font-medium">{studentData.yearOfCompletion}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-muted-foreground font-medium">
                    GPA/Percentage:
                  </p>
                  <p className="font-medium">{studentData.gpaPercentage}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-muted-foreground font-medium">Faculty:</p>
                  <p className="font-medium">{studentData.faculty}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-muted-foreground font-medium">
                    Interested Course:
                  </p>
                  <p className="font-medium">{studentData.interestedCourse}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-muted-foreground font-medium">
                    Overall PTE/IELTS Score:
                  </p>
                  <p className="font-medium">{studentData.language}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-md border border-gray-300 shadow-xs">
              <CardHeader className="flex gap-2 items-center">
                <Info className="text-blue-500" size={28} />
                <CardTitle className="text-xl font-medium">
                  Other Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
                <OtherInfoCard
                  icon={LiaMoneyBillWaveAltSolid}
                  title="PAYMENT"
                  status="Approved"
                  otherInfo="Last updated: Jan 25,2025"
                />
                <OtherInfoCard
                  icon={LiaMoneyBillWaveAltSolid}
                  title="PAYMENT"
                  status="Approved"
                  otherInfo="Last updated: Jan 25,2025"
                />
                <OtherInfoCard
                  icon={LiaMoneyBillWaveAltSolid}
                  title="PAYMENT"
                  status="Approved"
                  otherInfo="Last updated: Jan 25,2025"
                />
                <OtherInfoCard
                  icon={LiaMoneyBillWaveAltSolid}
                  title="PAYMENT"
                  status="Approved"
                  otherInfo="Last updated: Jan 25,2025"
                />
                <OtherInfoCard
                  icon={LiaMoneyBillWaveAltSolid}
                  title="PAYMENT"
                  status="Approved"
                  otherInfo="Last updated: Jan 25,2025"
                />
              </CardContent>
            </Card>
            <Card className="rounded-md border border-gray-300 shadow-xs">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="font-medium text-lg">Remarks</CardTitle>
                <CardTitle className="font-medium text-lg">
                  View Full History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RemarkCard />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
});

StudentProfile.displayName = "StudentProfile";

interface otherInfoCardProps {
  icon: React.ElementType;
  title: string;
  status?: string;
  otherInfo?: string;
}
const OtherInfoCard = ({
  icon: ICON,
  title,
  status,
  otherInfo,
}: otherInfoCardProps) => {
  const statusColor = (str?: string) => {
    if (!str) return null;
    switch (str) {
      case "Paid":
        return <p className="text-yellow-500 font-medium text-lg">{str}</p>;
      case "Received":
        return <p className="text-green-500 font-medium text-lg">{str}</p>;
      case "Approved":
        return <p className="text-blue-500 font-medium text-lg">{str}</p>;
      default:
        return <p className="text-gray-500 font-medium text-lg">{str}</p>;
    }
  };
  return (
    <Card className="p-2 gap-0">
      <CardHeader className="flex items-center gap-2 px-2">
        <ICON className="text-muted-foreground w-6 h-6 shrink-0" />
        <CardTitle className="font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        {statusColor(status)}
        <p className="text-muted-foreground">{otherInfo}</p>
      </CardContent>
    </Card>
  );
};
