import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentUser } from "@/lib/api/useUser";
import { Role, type StudentResponse } from "@/shared/interface/studentResponse";
import type { Payment } from "@/shared/types/paymentTypes";
import type { ColumnDef } from "@tanstack/react-table";
import { Activity, Eye, MessageSquareMore, Wallet } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface ActionButtonsProps {
  studentId: string;
}

const ActionButtons = React.memo<ActionButtonsProps>(({ studentId }) => {
  const { data: currentUser } = useCurrentUser();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isAccountant = currentUser?.data.role === Role.ACCOUNTANT;

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

      {!isAccountant && (
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
    </div>
  );
});

// Status Badge Component
const StatusBadge = React.memo<{ status: string | undefined }>(({ status }) => {
  const getStatusStyle = (status: string | undefined) => {
    const upperStatus = status?.toUpperCase();
    switch (upperStatus) {
      case "PARTIAL":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "UNPAID":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "PAID":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(
        status,
      )}`}
    >
      <p className="text-center">{status}</p>
    </div>
  );
});

StatusBadge.displayName = "StatusBadge";

export const PaymentColumn: ColumnDef<StudentResponse>[] = [
  {
    id: "fullName",
    header: "Full Name",
    accessorKey: "fullName",
    cell: ({ row }) => <p>{row.original.user?.fullName}</p>,
  },
  {
    id: "paymentDate",
    header: "Payment Date",
    accessorKey: "paymentDate",
    cell: ({ row }) => (
      <p>
        {row.original.payment?.createdAt
          ? new Date(row.original.payment.createdAt).toLocaleDateString()
          : "N/A"}
      </p>
    ),
  },
  {
    id: "language",
    header: "Language",
    accessorKey: "language",
    cell: ({ row }) => <p>{row.original.language}</p>,
  },
  {
    id: "balance",
    header: "Balance",
    accessorKey: "balance",
    cell: ({ row }) => <p>Rs {row.original.payment?.paymentAmount}</p>,
  },
  // {
  //   id: "dueDate",
  //   header: "Due Date",
  //   accessorKey: "dueDate",
  //   cell: ({ row }) => <p>{row.original.}</p>,
  // },
  {
    id: "paymentMethod",
    header: "Payment Method",
    accessorKey: "paymentMethod",
    cell: ({ row }) => <p>{row.original.payment?.paymentMethod}</p>,
  },
  {
    id: "Status",
    header: "Status",
    accessorKey: "Status",
    cell: ({ row }) => (
      <StatusBadge status={row.original.payment?.paymentStatus} />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionButtons studentId={row.original.id} />,
  },
];
