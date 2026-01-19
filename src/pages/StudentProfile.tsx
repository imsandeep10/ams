import React, { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Info,
  FileText,
  PlaneTakeoff,
  BookOpenText,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetStudentById } from "@/lib/api/useStudents";
import { IoEarth } from "react-icons/io5";
import { LiaMoneyBillWaveAltSolid } from "react-icons/lia";
import RemarkCard from "@/components/remarks/remarkCard";

export const StudentProfile = React.memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: student,
    isPending: isStudentLoading,
    error,
  } = useGetStudentById(id || "");

  const studentData = student
    ? {
        fullName: student?.user?.fullName || "N/A",
        email: student?.user?.email || "N/A",
        contactNumber: student?.user?.phoneNumber || "N/A",
        academicQualification: student?.academicQualification || "N/A",
        yearOfCompletion: student?.yearOfCompletion || "N/A",
        countryWishToApply: student?.preferredCountry || "N/A",
        language: student?.language || "N/A",
        faculty: student?.faculty || "N/A",
        classTime: student?.classTime || "N/A",
        gpaPercentage: student?.gpaOrPercentage || "N/A",
        interestedCourse: student?.interestedCourse || "N/A",
        profileImage: student?.user?.profileImage?.url || "profile.svg",
        address: student?.user?.address || "N/A",
      }
    : null;

  if (isStudentLoading)
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="w-full mx-auto">
          <Skeleton className="h-10 w-24 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="col-span-1 flex flex-col gap-6">
              <Card className="rounded-md border border-gray-300 shadow-xs">
                <CardContent className="gap-4 flex flex-col">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Skeleton className="rounded-full w-40 h-40" />
                    <div className="mt-2 space-y-2">
                      <Skeleton className="h-8 w-48 mx-auto" />
                      <Skeleton className="h-5 w-32 mx-auto" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-6" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-6" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-6" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-md border border-gray-300 shadow-xs">
                <CardHeader className="flex gap-2 items-center">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="grid grid-cols-[2fr_1fr] gap-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                  <div className="grid grid-cols-[2fr_1fr] gap-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="col-span-2 flex flex-col gap-6">
              <Card className="rounded-md border border-gray-300 shadow-xs">
                <CardHeader className="flex gap-2 items-center">
                  <Skeleton className="h-7 w-7 rounded-full" />
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-x-2 gap-y-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-3/4" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-md border border-gray-300 shadow-xs">
                <CardHeader className="flex gap-2 items-center">
                  <Skeleton className="h-7 w-7 rounded-full" />
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i} className="p-2 gap-0">
                      <CardHeader className="flex items-center gap-2 px-2">
                        <Skeleton className="h-6 w-6 rounded" />
                        <Skeleton className="h-5 w-20" />
                      </CardHeader>
                      <CardContent className="p-2 space-y-2">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-md border border-gray-300 shadow-xs">
                <CardHeader className="flex justify-between items-center">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-36" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
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

  const getDocumentStatus = (status: string | null | undefined) => {
    switch (status) {
      case "DOCUMENT_NOT_RECEIVED":
        return "NOT RECEIVED";
      case "DOCUMENT_RECEIVED":
        return "RECEIVED";
      case "WITHDRAWN":
        return "WITHDRAWN";
      case "VISA_LODGE":
      case "VISA_RECEIVED":
        return "RECEIVED";
      default:
        return "N/A";
    }
  };

  const getVisaStatus = (status: string | null | undefined) => {
    switch (status) {
      case "VISA_LODGE":
        return "LODGED";
      case "VISA_RECEIVED":
        return "RECEIVED";
      case "WITHDRAWN":
        return "WITHDRAWN";
      case "DOCUMENT_NOT_RECEIVED":
      case "DOCUMENT_RECEIVED":
        return "PENDING";
      default:
        return "N/A";
    }
  };

  const documentStatus = getDocumentStatus(student?.currentApplicationStatus);
  const visaStatus = getVisaStatus(student?.currentApplicationStatus);

  const otherInfoCardData = [
    {
      icon: LiaMoneyBillWaveAltSolid,
      title: "PAYMENT",
      status: student?.payment?.paymentStatus?.replaceAll("_", " ") ?? "N/A",
    },
    {
      icon: FileText,
      title: "DOCUMENTS",
      status: documentStatus,
    },
    {
      icon: PlaneTakeoff,
      title: "VISA STATUS",
      status: visaStatus,
    },
    {
      icon: BookOpenText,
      title: "BOOK STATUS",
      status: student?.payment?.bookStatus?.replaceAll("_", " ") ?? "N/A",
    },
    {
      icon: Calendar,
      title: "DATEBOOK",
      status: student?.currentStudentStatus?.replaceAll("_", " ") ?? "N/A",
    },
  ];

  const remarkData: {
    id: number;
    date: string;
    role: string;
    remark: string;
  }[] = [];

  for (let i = 0; i < student?.remark?.length; i++) {
    const splittedRemarks = student?.remark[i].split(" ");

    if (student?.remark !== null) {
      remarkData.push({
        id: i + 1,
        date: splittedRemarks[0]?.replace(/[\[\]]/g, ""),
        role: splittedRemarks[1]?.replace(/[\[\]]/g, ""),
        remark: splittedRemarks
          .join(" ")
          .slice(splittedRemarks[0].length + splittedRemarks[1].length + 2),
      });
    } else {
      remarkData.push({
        id: i + 1,
        date: "N/A",
        role: "N/A",
        remark: "N/A",
      });
    }
  }

  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-gray-200 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 flex flex-col gap-6">
            <Card className="rounded-md border border-gray-300 shadow-xs">
              <CardContent className="gap-4 flex flex-col">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Avatar className="bg-green-50 rounded-full w-40 h-40 aspect-square ">
                    <AvatarImage src={studentData?.profileImage} />
                    <AvatarFallback className="text-4xl font-medium">
                      {getInitials(studentData?.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mt-2">
                    <h3 className="text-2xl font-medium text-center">
                      {studentData?.fullName}
                    </h3>
                    <p className="text-muted-foreground text-center font-medium">
                      {studentData?.academicQualification}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Mail className="shrink-0" />
                  <p>{studentData?.email}</p>
                </div>
                <div className="flex gap-2">
                  <Phone className="shrink-0" />
                  <p>{studentData?.contactNumber}</p>
                </div>
                <div className="flex gap-2">
                  <MapPin className="shrink-0" />
                  <p>{studentData?.address}</p>
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
                    {studentData?.countryWishToApply}
                  </p>
                </div>
                <div className="grid grid-cols-[2fr_1fr] gap-2">
                  <p className="text-muted-foreground font-medium">
                    Language Proficiency:
                  </p>
                  <p className="font-medium">{studentData?.language}</p>
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
                    {studentData?.academicQualification}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-muted-foreground font-medium">
                    Year of Completion:
                  </p>
                  <p className="font-medium">{studentData?.yearOfCompletion}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-muted-foreground font-medium">
                    GPA/Percentage:
                  </p>
                  <p className="font-medium">{studentData?.gpaPercentage}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-muted-foreground font-medium">Faculty:</p>
                  <p className="font-medium">{studentData?.faculty}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-muted-foreground font-medium">
                    Interested Course:
                  </p>
                  <p className="font-medium">{studentData?.interestedCourse}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-muted-foreground font-medium">
                    Overall PTE/IELTS Score:
                  </p>
                  <p className="font-medium">{studentData?.language}</p>
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
              <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {otherInfoCardData.map((item) => (
                  <OtherInfoCard
                    icon={item.icon}
                    title={item.title}
                    status={item.status}
                    key={item.title}
                  />
                ))}
              </CardContent>
            </Card>
            <Card className="rounded-md border border-gray-300 shadow-xs gap-2">
              <CardHeader>
                <CardTitle className="font-medium text-lg">Remarks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {student?.remark && student.remark.length > 0 ? (
                  remarkData
                    .slice(0, currentIndex + 3)
                    .map((r) => <RemarkCard key={r.id} {...r} />)
                ) : (
                  <p className="text-gray-600">No remarks available.</p>
                )}
              </CardContent>

              <CardFooter className="mt-4">
                <Button
                  onClick={() => setCurrentIndex(currentIndex + 3)}
                  variant={"outline"}
                  size={"icon-lg"}
                  className={`rounded-full mx-auto ${currentIndex + 3 >= remarkData.length ? "" : "animate-bounce"}`}
                  disabled={currentIndex + 3 >= remarkData.length}
                >
                  <ChevronDown className="" />
                </Button>
              </CardFooter>
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
const OtherInfoCard = ({ icon: ICON, title, status }: otherInfoCardProps) => {
  const statusColor = (str?: string) => {
    if (!str) return null;
    switch (str.toLowerCase()) {
      case "paid in full":
        return (
          <p className="text-yellow-500 font-normal lg:font-medium md:text-md">
            {str}
          </p>
        );
      case "not paid":
        return (
          <p className="text-red-500 font-normal lg:font-medium md:text-md">
            {str}
          </p>
        );
      case "partial paid":
        return (
          <p className="text-orange-500 font-normal lg:font-medium md:text-md">
            {str}
          </p>
        );
      case "book taken":
        return (
          <p className="text-green-500 font-normal lg:font-medium md:text-md">
            {str}
          </p>
        );
      case "book not taken":
        return (
          <p className="text-red-500 font-normal lg:font-medium md:text-md">
            {str}
          </p>
        );
      case "pending":
        return (
          <p className="text-orange-500 font-normal lg:font-medium md:text-md">
            {str}
          </p>
        );
      case "rejected":
        return (
          <p className="text-red-500 font-normal lg:font-medium md:text-md">
            {str}
          </p>
        );
      case "not sent":
        return (
          <p className="text-gray-500 font-normal lg:font-medium md:text-md">
            {str}
          </p>
        );
      case "not received":
        return (
          <p className="text-gray-500 font-normal lg:font-medium md:text-md">
            {str}
          </p>
        );
      case "not accepted":
        return (
          <p className="text-gray-500 font-normal lg:font-medium md:text-md">
            {str}
          </p>
        );
      case "sent":
        return (
          <p className="text-blue-500 font-normal lg:font-medium md:text-md">
            {str}
          </p>
        );
      case "received":
        return (
          <p className="text-green-500 font-normal lg:font-medium md:text-md">
            {str}
          </p>
        );
      case "accepted":
        return (
          <p className="text-blue-500 font-normal lg:font-medium md:text-md">
            {str}
          </p>
        );
      default:
        return (
          <p className="text-gray-500 font-normal lg:font-medium md:text-md">
            {str}
          </p>
        );
    }
  };
  return (
    <Card className="p-2 gap-0">
      <CardHeader className="flex items-center justify-start gap-2 p-0">
        <ICON className="text-muted-foreground w-6 h-6 shrink-0" />
        <CardTitle className="font-medium text-sm lg:text-base">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 font-medium md:text-sm lg:text-base ">
        {statusColor(status)}
      </CardContent>
    </Card>
  );
};
