import React, { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Trash2,
  Bell,
  Phone,
  Mail,
  Clock,
  ArrowUpDown,
  Activity,
  Edit,
} from "lucide-react";
import type { Student } from "@/types/studentTypes";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteStudent } from "@/lib/api/useStudents";
import { toast } from "sonner";

// QR Code Component with Dialog
const QRCodeDisplay = React.memo(
  ({ qrCodeDataUrl }: { qrCodeDataUrl: string }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleQRClick = () => {
      setIsDialogOpen(true);
    };

    return (
      <>
        <div
          className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={handleQRClick}
        >
          <img src={qrCodeDataUrl} alt="QR Code" className="w-10 h-10" />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Student QR Code</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="bg-white p-4 rounded-lg">
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code"
                  className="w-64 h-64 mx-auto"
                />
              </div>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Scan this QR code to view student information
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

QRCodeDisplay.displayName = "QRCodeDisplay";

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
  )
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
    const { mutateAsync, isPending } = useDeleteStudent();

    const handleConfirmDelete = async () => {
      try {
        await mutateAsync(studentId);
        setIsOpen(false);
      } catch (error: any) {
        toast.error(`Failed to delete student: ${error.message}`);
      }
    };

    const handleView = () => {
      navigate(`/student-profile/${studentId}`);
    };

    const handleTrack = () => {
      navigate(`/student-track/${studentId}`);
    };

    const handleEdit = () => {
      navigate(`/edit-student/${studentId}?language=${studentLanguage}`);
    };

    const handleDelete = () => {
      setIsOpen(true);
    };

    const handleNotify = () => {};

    return (
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 cursor-pointer"
              onClick={handleView}
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
              onClick={handleTrack}
            >
              <Activity className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Student Track</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-yellow-500 hover:bg-yellow-50  cursor-pointer"
              onClick={handleEdit}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit student</p>
          </TooltipContent>
        </Tooltip>

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

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 w-80 max-w-full mx-4">
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              <p className="mb-6">
                Are you sure you want to delete this student? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  className=" cursor-pointer"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white  cursor-pointer"
                  onClick={handleConfirmDelete}
                  disabled={isPending}
                >
                  {isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-orange-600 hover:bg-orange-50  cursor-pointer"
              onClick={handleNotify}
            >
              <Bell className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notify</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }
);

ActionButtons.displayName = "ActionButtons";

export const columns: ColumnDef<Student>[] = [
  {
    id: "studentInfo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Student Info
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "name",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex flex-col gap-1">
          <div className="font-semibold">{student.name}</div>
          <div className="text-xs text-gray-500">ID: {student.studentId}</div>
          <div className="text-xs text-gray-500">
            Faculty: {student.faculty}
          </div>
        </div>
      );
    },
  },
  {
    id: "qr",
    header: "QR",
    cell: ({ row }) => {
      const qrCodeDataUrl = row.original.qrCode?.qrCodeDataUrl;
      return qrCodeDataUrl ? (
        <QRCodeDisplay qrCodeDataUrl={qrCodeDataUrl} />
      ) : (
        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
          No QR
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: "classTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Class Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "classTime",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{student.classTime}</span>
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
      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{student.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{student.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "courseInfo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Course Info
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "interestedCourse",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">{student.language}</div>

          <div className="text-xs text-gray-500">
            Country: {student.preferredCountry}
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
