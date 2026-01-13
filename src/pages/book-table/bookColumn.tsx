import type { ColumnDef } from "@tanstack/react-table";
import type { createMockRegisterRespoonse } from "@/shared/types/mockFormTypes";
// import { useNavigate } from "react-router-dom";
// import { Edit } from "lucide-react";
import React from "react";
// import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
// import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  id: string;
}

const ActionButtons = React.memo<ActionButtonsProps>(() => {
//   const navigate = useNavigate();
//   const handleView = () => {
//     navigate(`/payment`); // add payment edit route here
//   };
  return (
  <>
  <div className="flex items-center gap-2">

      {/* <Tooltip>
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
      </Tooltip> */}

    </div>
  </>
  );
});

export const BookColumn: ColumnDef<createMockRegisterRespoonse>[] = [
  {
    id: "studentName",
    header: () => {
      return <span className="">Student Name</span>;
    },
    accessorKey: "fullName",
    cell: ({ row }) => {
      return <span>{row.original.fullName}</span>;
    },
  },
  {
    id: "whatsappNumber",
    header: () => {
      return <span className="">WhatsApp Number</span>;
    },
    accessorKey: "whatsappNumber",
    cell: ({ row }) => {
      return <span>{row.original.whatsappNumber}</span>;
    },
  },
//   {
//     id: "email",
//     header: () => {
//       return <span className="">Email</span>;
//     },
//     accessorKey: "email",
//     cell: ({ row }) => {
//       return <span>{row.original.email}</span>;
//     },
//   },
//   {
//     id: "status",
//     header: () => {
//       return <span className="">Status</span>;
//     },
//     accessorKey: "status",
//     cell: ({ row }) => {
//       const theStatus = row.original?.status || [];
//       if (!theStatus || theStatus.length === 0) {
//         return <span className="text-sm">N/A</span>;
//       }
//       return (
//         <div className="flex flex-col">
//           {theStatus?.map((value, index) => (
//             <span key={index} className="text-sm">
//               {value}
//             </span>
//           ))}
//         </div>
//       );
//     },
//   },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    accessorKey: "id",
    cell: ({ row }) => {
      return <ActionButtons id={row.original.id} />;
    },
  },
];
