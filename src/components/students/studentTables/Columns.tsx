import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Student } from "@/shared/types/studentTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Language Badge Component
const LanguageBadge = React.memo<{ language: string }>(({ language }) => {
  const getLanguageStyle = (lang: string) => {
    const upperLang = lang.toUpperCase();
    switch (upperLang) {
      case "IELTS":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "PTE":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "TOEFL":
        return "bg-green-100 text-green-800 border-green-300";
      case "DUOLINGO":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "SAT":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold border ${getLanguageStyle(
        language
      )}`}
    >
      <p className="text-center">{language}</p>
    </div>
  );
});

LanguageBadge.displayName = "LanguageBadge";

export const columns: ColumnDef<Student>[] = [
  {
    id: "profilePicture",
    header: "Profile",
    accessorKey: "profilePicture",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center justify-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
          <Avatar>
            <AvatarImage
              src={student.image || "/default-avatar.png"}
              alt={student.name}
            />
            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    id: "fullName",
    header: "Full Name",
    accessorKey: "name",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex flex-col gap-1 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
          <p className="font-semibold">{student.name}</p>
        </div>
      );
    },
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
          <p>{student.email || "N/A"}</p>
        </div>
      );
    },
  },

  {
    id: "phoneNumber",
    header: "Phone no.",
    accessorKey: "phone",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex flex-col gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
          <p className="text-sm">{student.phone || "N/A"}</p>
        </div>
      );
    },
  },
  {
    id: "academicQualification",
    header: "Academic Qualification",
    accessorKey: "academicQualification",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex flex-col gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
          <p className="text-sm font-medium">
            {student.academicQualification || "N/A"}
          </p>
        </div>
      );
    },
  },
  {
    id: "completion",
    header: "Completion",
    accessorKey: "yearOfCompletion",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex flex-col gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
          <p className="text-sm font-medium">
            {student.yearOfCompletion || "N/A"}
          </p>
        </div>
      );
    },
  },
  {
    id: "gpa",
    header: "GPA",
    accessorKey: "gpaOrPercentage",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex flex-col gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
          <p className="text-sm font-medium">
            {student.gpaOrPercentage || "N/A"}
          </p>
        </div>
      );
    },
  },
  {
    id: "preferedCountry",
    header: "Preferred Country",
    accessorKey: "preferredCountry",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex flex-col gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
          <p className="text-sm font-medium">
            {student.preferredCountry || "N/A"}
          </p>
        </div>
      );
    },
  },
  {
    id: "faculty",
    header: "Faculty",
    accessorKey: "faculty",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex flex-col gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
          <p className="text-sm font-medium">{student.faculty || "N/A"}</p>
        </div>
      );
    },
  },
  {
    id: "classTime",
    header: "Class Time",
    accessorKey: "classTime",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex flex-col gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
          <p className="text-sm font-medium">{student.classTime || "N/A"}</p>
        </div>
      );
    },
  },
  {
    id: "languageTest",
    header: "Language Test",
    accessorKey: "language",
    cell: ({ row }) => {
      const student = row.original;

      return (
        <div className="flex flex-col gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
          <LanguageBadge language={student.language} />
        </div>
      );
    },
  },
  {
    id: "interestedCourse",
    header: "Interested Course",
    accessorKey: "interestedCourse",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex flex-col gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
          <p className="text-sm font-medium">
            {student.interestedCourse || "N/A"}
          </p>
        </div>
      );
    },
  },
];
