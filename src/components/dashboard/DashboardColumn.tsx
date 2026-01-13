"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import type { Student } from "@/shared/types/studentTypes";

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

export const dashboardColumns: ColumnDef<Student>[] = [
  {
    id: "studentName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3 text-white hover:text-white hover:bg-primary/90 -ml-2"
        >
          Student Name
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
          className="h-8 px-2 lg:px-3 text-white hover:text-white hover:bg-primary/90 -ml-2"
        >
          Phone Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "registrationDate",
    cell: ({ row }) => {
      const student = row.original;
      return <div className="text-sm">{student.phone || "Not available"}</div>;
    },
  },
  {
    id: "language",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3 text-white hover:text-white hover:bg-primary/90 -ml-2"
        >
          Language
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "language",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="text-sm font-medium">
          {student.language || "English"}
        </div>
      );
    },
  },
  {
    id: "attendenceStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3 text-white hover:text-white hover:bg-primary/90 -ml-2"
        >
          Attendance Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "attendanceStatus",
    cell: ({ row }) => {
      const student = row.original;
      return <StatusBadge status={student.attendanceStatus || "Absent"} />;
    },
  },
];
