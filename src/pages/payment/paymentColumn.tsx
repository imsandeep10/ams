import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Payment } from "@/shared/types/paymentTypes";
import type { ColumnDef } from "@tanstack/react-table";
import { Activity, Eye, MessageSquareMore, Wallet } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface ActionButtonsProps {
  studentId: string;
}

const ActionButtons = React.memo<ActionButtonsProps>(({ studentId }) => {
  const navigate = useNavigate();
  3;

  const handleNavigation = (path: string) => {
    navigate(path);
  };

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

export const PaymentColumn: ColumnDef<Payment>[] = [
  {
    id: "fullName",
    header: "Full Name",
    accessorKey: "fullName",
    cell: ({ row }) => <span>{row.original.fullName}</span>,
  },
  {
    id: "paymentDate",
    header: "Payment Date",
    accessorKey: "paymentDate",
    cell: ({ row }) => <span>{row.original.paymentDate}</span>,
  },
  {
    id: "language",
    header: "Language",
    accessorKey: "language",
    cell: ({ row }) => <span>{row.original.language}</span>,
  },
  {
    id: "balance",
    header: "Balance",
    accessorKey: "balance",
    cell: ({ row }) => <span>${row.original.balance.toFixed(2)}</span>,
  },
  {
    id: "dueDate",
    header: "Due Date",
    accessorKey: "dueDate",
    cell: ({ row }) => <span>{row.original.dueDate}</span>,
  },
  {
    id: "paymentMethod",
    header: "Payment Method",
    accessorKey: "paymentMethod",
    cell: ({ row }) => <span>{row.original.paymentMethod}</span>,
  },
  {
    id: "Status",
    header: "Status",
    accessorKey: "Status",
    cell: ({ row }) => <span>{row.original.Status}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionButtons studentId={row.original.id} />,
  },
];
