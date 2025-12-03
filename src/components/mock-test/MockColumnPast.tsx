import React, { useState } from "react";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2, Phone, Clock, ArrowUpDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { Mock } from "@/types/mockFormTypes";
import { useDeleteMock } from "@/lib/api/useMockRegister";

// Fixed ActionButtons component
interface ActionButtonsProps {
  studentId: string;
}

const ActionButtons = React.memo<ActionButtonsProps>(({ studentId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync, isPending } = useDeleteMock();

  const handleConfirmDelete = async () => {
    if (!studentId) {
      toast.error("Student ID is missing!");
      return;
    }

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

  return (
    <div className="flex items-center gap-2">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 w-full">
          <div className="bg-white rounded-lg p-6 w-80 max-w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6 text-wrap">
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
    </div>
  );
});

ActionButtons.displayName = "ActionButtons";

export const getMockColumnPast = (): ColumnDef<Mock>[] => [
  {
    id: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "fullName",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex flex-col gap-1">
          <div className="font-semibold">{student.fullName}</div>
        </div>
      );
    },
  },
  {
    id: "mockTestDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Date Of Mock Test
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "mockTestDate",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{student.mockTestDate}</span>
        </div>
      );
    },
  },
  {
    id: "timeSlot",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Prefered Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">
            {student.timeSlot?.length ? student.timeSlot : "N/A"}
          </div>
        </div>
      );
    },
  },

  {
    id: "whatsappNumber",
    header: "whatsappNumber",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{student.whatsappNumber}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "modulesCompleted",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          ModulesCompleted
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">
            {student.modulesCompleted?.length
              ? student.modulesCompleted
              : "N/A"}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionButtons studentId={row?.original?.id} />,
    enableSorting: false,
  },
];
