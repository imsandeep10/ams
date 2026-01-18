import type { ColumnDef } from "@tanstack/react-table";
import MockActionButtons from "./mockTestAction";
import type { createMockRegisterRespoonse } from "@/shared/types/mockFormTypes";

export const columnsMockTest: ColumnDef<createMockRegisterRespoonse>[] = [
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
    id: "Date",
    header: () => {
      return <span className="">Date of Mock Test</span>;
    },
    accessorKey: "mockTestDate",
    cell: ({ row }) => {
      return <span>{row.original.mockTestDate}</span>;
    },
  },
  {
    id: "timeSlot",
    header: () => {
      return <span className="">Time Slot</span>;
    },
    accessorKey: "timeSlot",
    cell: ({ row }) => {
      return <span>{row.original.timeSlot}</span>;
    },
  },
  {
    id: "testType",
    header: () => {
      return <span className="">Test Type</span>;
    },
    accessorKey: "testType",
    cell: ({ row }) => {
      return <span>{row.original.testType}</span>;
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
  {
    id: "moduleCompleted",
    header: () => {
      return <span className="">Module Completed</span>;
    },
    accessorKey: "moduleCompleted",
    cell: ({ row }) => {
      const moduleComplete = row.original.modulesCompleted;
      if (!moduleComplete || moduleComplete.length === 0) {
        return <span className="text-sm">N/A</span>;
      }
      return (
        <div className="flex flex-col">
          {moduleComplete.map((module, index) => (
            <span key={index} className="text-sm">
              {module}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    accessorKey: "id",
    cell: ({ row }) => {
      return <MockActionButtons id={row.original.id} />;
    },
  },
];
