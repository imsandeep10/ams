import React, { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Phone, Mail, ArrowUpDown, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useDeleteAdmin } from "@/lib/api/useAdmin";
import type { createAdminTypes } from "@/types/createAdminTypes";

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

interface ActionButtonsProps {
  adminId: string;
}

const ActionButtons = React.memo<ActionButtonsProps>(({ adminId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useDeleteAdmin();

  const handleConfirmDelete = async () => {
    try {
      await mutateAsync(adminId);
      setIsOpen(false);
    } catch (error: any) {
      toast.error(`Failed to delete Admin: ${error.message}`);
    }
  };

  const handleView = () => {
    navigate(`/admin-profile/${adminId}`);
  };

  const handleEdit = () => {
    navigate(`/edit-admin/${adminId}`);
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
            className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 cursor-pointer"
            onClick={handleView}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View Admin Profile</p>
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
          <p>Edit Admin</p>
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
          <p>Delete Admin</p>
        </TooltipContent>
      </Tooltip>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
         <p className="mb-6 break-words whitespace-normal">
  Are you sure you want to delete this Admin? This action cannot be undone.
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

export const AdminColumn: ColumnDef<createAdminTypes>[] = [
  {
    id: "adminInfo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Admin Info
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "fullName",
    cell: ({ row }) => {
      const admin = row.original;
      return (
        <div className="flex flex-col gap-1">
          <div className="font-semibold">{admin.fullName}</div>
        </div>
      );
    },
  },

  {
    id: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          Email
        </Button>
      );
    },
    accessorKey: "email",
    cell: ({ row }) => {
      const admin = row.original;
      return (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{admin.email}</span>
        </div>
      );
    },
  },

  {
    id: "phoneNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          Phone Number
        </Button>
      );
    },
    accessorKey: "phoneNumber",
    cell: ({ row }) => {
      const admin = row.original;
      return (
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{admin.phoneNumber}</span>
        </div>
      );
    },
  },

  {
    id: "address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
          Address
        </Button>
      );
    },
    accessorKey: "address",
    cell: ({ row }) => {
      const admin = row.original;
      return (
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">{admin.address}</div>
        </div>
      );
    },
  },

  {
    id: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "role",
    // FIX: Changed from phoneNumber to role
    cell: ({ row }) => {
      const admin = row.original;
      return (
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">{admin.role}</div>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionButtons adminId={row.original.id} />,
    enableSorting: false,
  },
];
