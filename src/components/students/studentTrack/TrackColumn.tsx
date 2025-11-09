"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface DailyRecord {
  date: string;
  day: number;
  dayName: string;
  status: "PRESENT" | "ABSENT";
  isWeekend: boolean;
}

export const trackColumns: ColumnDef<DailyRecord>[] = [
  {
    id: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "date",
    cell: ({ row }) => {
      const date = row.original.date;
      // Format date nicely
      const formattedDate = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      return (
        <div className="text-sm font-medium">
          {formattedDate}
        </div>
      );
    },
  },
  {
    id: "day",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Day
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "day",
    cell: ({ row }) => {
      return (
        <div className="text-sm text-center font-semibold">
          {row.original.day}
        </div>
      );
    },
  },
  {
    id: "dayName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Day Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "dayName",
    cell: ({ row }) => {
      return (
        <div className="text-sm font-medium">
          {row.original.dayName}
        </div>
      );
    },
  },
  {
    id: "isWeekend",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Weekend
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "isWeekend",
    cell: ({ row }) => {
      const isWeekend = row.original.isWeekend;
      return (
        <div className="text-center">
          {isWeekend ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Yes
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
              No
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="text-center">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              status === "PRESENT"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-1.5 ${
                status === "PRESENT" ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {status}
          </span>
        </div>
      );
    },
  },
];