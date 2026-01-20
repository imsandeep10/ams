import React, { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Trash2,
  Phone,
  Mail,
  Clock,
  Activity,
  Edit,
  Wallet,
  MessageSquareMore,
} from "lucide-react";
import type { Student } from "@/shared/types/studentTypes";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useDeleteStudent } from "@/lib/api/useStudents";
import { toast } from "sonner";
import { useCurrentUser } from "@/lib/api/useUser";
import { Role } from "@/shared/interface/studentResponse";
import DeleteModal from "@/components/model/deleteModel";

// Status Badge Component
const StatusBadge = React.memo<{ status: "Present" | "Absent" }>(
  ({ status }) => (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        status === "Present"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full mr-1 ${
          status === "Present" ? "bg-green-500" : "bg-red-500"
        }`}
      />
      {status}
    </div>
  ),
);

StatusBadge.displayName = "StatusBadge";

// Fixed ActionButtons component
interface ActionButtonsProps {
  studentId: string;
  studentLanguage: string;
}

const ActionButtons = React.memo<ActionButtonsProps>(
  ({ studentId, studentLanguage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    3;

    const { data: currentUserData } = useCurrentUser();
    const { mutateAsync } = useDeleteStudent();

    const handleConfirmDelete = async () => {
      try {
        await mutateAsync(studentId);
        setIsOpen(false);
      } catch (error: any) {
        toast.error(`Failed to delete student: ${error.message}`);
      }
    };

    const handleDelete = () => {
      setIsOpen(true);
    };

    const handleNavigation = (path: string) => {
      navigate(path);
    };

    const isAccountant = currentUserData?.data.role === Role.ACCOUNTANT;
    const isIeltsAdmin = currentUserData?.data.role === Role.IELTS_ADMIN;
    return (
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 cursor-pointer"
              onClick={() => handleNavigation(`/student-profile/${studentId}`)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Student Profile</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50  cursor-pointer"
              onClick={() => handleNavigation(`/student-track/${studentId}`)}
            >
              <Activity className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Student Track</p>
          </TooltipContent>
        </Tooltip>

        {!isAccountant && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-yellow-500 hover:bg-yellow-50  cursor-pointer"
                onClick={() =>
                  handleNavigation(
                    `/edit-student/${studentId}?language=${studentLanguage}`,
                  )
                }
              >
                <Edit className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit student</p>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              size={"sm"}
              className="h-8 w-8 p-0 text-green-900 hover:bg-green-50  cursor-pointer"
              onClick={() => handleNavigation(`/student-payment/${studentId}`)}
            >
              <Wallet />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Payment</p>
          </TooltipContent>
        </Tooltip>

        {!isIeltsAdmin && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                size={"sm"}
                className="h-8 w-8 p-0 text-[#1DC794] hover:bg-[#e9fff8] hover:text-[#003d2b]  cursor-pointer"
                onClick={() => handleNavigation(`/student-remark/${studentId}`)}
              >
                <MessageSquareMore />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remark</p>
            </TooltipContent>
          </Tooltip>
        )}

        {!isAccountant && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50  cursor-pointer"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete student</p>
            </TooltipContent>
          </Tooltip>
        )}

        <DeleteModal
          open={isOpen}
          onOpenChange={setIsOpen}
          onConfirm={handleConfirmDelete}
        />
      </div>
    );
  },
);

ActionButtons.displayName = "ActionButtons";

export const LangugaeColumns: ColumnDef<Student>[] = [
  {
    id: "studentInfo",
    header: "Student Info",
    accessorKey: "name",
    cell: ({ row }) => {
      const student = row.original;
      const navigate = useNavigate();

      const handleRowClick = () => {
        navigate(`/student-profile/${student.id}`);
      };

      return (
        <div
          className="flex flex-col gap-1 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
          onClick={handleRowClick}
        >
          <div className="font-semibold">{student.name}</div>
          <div className="text-xs text-gray-500">ID: {student.id}</div>
          <div className="text-xs text-gray-500">
            Faculty: {student.faculty || "N/A"}
          </div>
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
      const navigate = useNavigate();

      const handleRowClick = () => {
        navigate(`/student-profile/${student.id}`);
      };

      return (
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
          onClick={handleRowClick}
        >
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{student.classTime || "N/A"}</span>
        </div>
      );
    },
  },

  {
    id: "contact",
    header: "Contact",
    accessorKey: "email",
    cell: ({ row }) => {
      const student = row.original;
      const navigate = useNavigate();

      const handleRowClick = () => {
        navigate(`/student-profile/${student.id}`);
      };

      return (
        <div
          className="flex flex-col gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
          onClick={handleRowClick}
        >
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{student.phone || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{student.email || "N/A"}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "courseInfo",
    header: "Course Info",
    accessorKey: "interestedCourse",
    cell: ({ row }) => {
      const student = row.original;
      const navigate = useNavigate();

      const handleRowClick = () => {
        navigate(`/student-profile/${student.id}`);
      };

      return (
        <div
          className="flex flex-col gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
          onClick={handleRowClick}
        >
          <div className="text-sm font-medium">{student.language || "N/A"}</div>

          <div className="text-xs text-gray-500">
            Country: {student.preferredCountry || "N/A"}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionButtons
        studentId={row.original.id}
        studentLanguage={row.original.language}
      />
    ),
    enableSorting: false,
  },
];
