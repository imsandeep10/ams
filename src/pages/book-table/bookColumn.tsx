import type { ColumnDef } from "@tanstack/react-table";
import type { bookInfo } from "@/shared/types/bookTypes";
import { useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  id: string;
}

const ActionButtons = React.memo<ActionButtonsProps>(() => {
  const navigate = useNavigate();
  const handleEdit = () => {
    navigate(`/payment`); // add payment edit route here
  };
  return (
  <>
  <div className="flex items-center gap-2">

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
          <p>Edit Books</p>
        </TooltipContent>
      </Tooltip>

    </div>
  </>
  );
});

export const BookColumn: ColumnDef<bookInfo>[] = [
  {
    id: "studentName",
    header: () => {
      return <span className="">Student Name</span>;
    },
    accessorKey: "fullName",
    cell: ({ row }) => {
      return <span>{row.original.user?.fullName}</span>;
    },
  },
  {
    id: "whatsappNumber",
    header: () => {
      return <span className="">WhatsApp Number</span>;
    },
    accessorKey: "whatsappNumber",
    cell: ({ row }) => {
      return <span>{row.original.user?.phoneNumber}</span>;
    },
  },
  {
    id: "email",
    header: () => {
      return <span className="">Email</span>;
    },
    accessorKey: "email",
    cell: ({ row }) => {
      return <span>{row.original.user?.email}</span>;
    },
  },
  {
    id: "status",
    header: () => {
      return <span className="">Status</span>;
    },
    accessorKey: "status",
    cell: ({ row }) => {
      const payment = row.original?.payment;
      const theStatus = payment ? payment.bookStatus : null;
      
      const statusMap: Record<string, string> = {
        NO_BOOK_TAKEN: "No Book Taken",
        TWO_BOOKS_TAKEN: "Two Books Taken",
        ALL_BOOK_TAKEN: "Book Taken",
      };

      return (
        <span className="text-sm">
          {theStatus ? statusMap[theStatus] ?? theStatus : "N/A"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    accessorKey: "id",
    cell: ({ row }) => {
      return <ActionButtons id={row.original.id} />;
    },
  },
];
