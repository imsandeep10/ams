import React from "react";
import { Search } from "lucide-react";

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const TableRowSkeleton = () => (
  <tr className="border-b hover:bg-gray-50">
    {/* Student Info Column */}
    <td className="py-4 px-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-28" />
      </div>
    </td>

    {/* QR Column */}
    <td className="py-4 px-4">
      <Skeleton className="w-10 h-10 rounded" />
    </td>

    {/* Contact Column */}
    <td className="py-4 px-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>
    </td>

    {/* Class Time Column */}
    <td className="py-4 px-4">
      <div className="flex items-center gap-2">
        <Skeleton className="w-4 h-4 rounded" />
        <Skeleton className="h-4 w-24" />
      </div>
    </td>

    {/* Attendance Column */}
    <td className="py-4 px-4">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-28" />
      </div>
    </td>

    {/* Status Column */}
    <td className="py-4 px-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    </td>

    {/* Actions Column */}
    <td className="py-4 px-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </td>
  </tr>
);

export const DataTableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-4">
      {/* Header Controls Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-4 w-4" />
            <div className="pl-10 h-10 w-64 bg-gray-100 rounded-md border" />
          </div>
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-md border">
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr className="bg-primary/60">
              <th className="text-left py-3 px-4">
                <Skeleton className="h-5 w-28 bg-primary/40" />
              </th>
              <th className="text-left py-3 px-4">
                <Skeleton className="h-5 w-8 bg-primary/40" />
              </th>
              <th className="text-left py-3 px-4">
                <Skeleton className="h-5 w-20 bg-primary/40" />
              </th>
              <th className="text-left py-3 px-4">
                <Skeleton className="h-5 w-24 bg-primary/40" />
              </th>
              <th className="text-left py-3 px-4">
                <Skeleton className="h-5 w-24 bg-primary/40" />
              </th>
              <th className="text-left py-3 px-4">
                <Skeleton className="h-5 w-16 bg-primary/40" />
              </th>
              <th className="text-left py-3 px-4">
                <Skeleton className="h-5 w-20 bg-primary/40" />
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <TableRowSkeleton key={index} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <Skeleton className="h-5 w-48" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default function SkeletonDemo() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Student Management
          </h1>
          <p className="text-gray-600">
            {loading ? "Loading students..." : "Students loaded!"}
          </p>
        </div>

        {loading ? (
          <DataTableSkeleton rows={5} />
        ) : (
          <div className="bg-white p-8 rounded-lg border text-center">
            <p className="text-gray-600">
              Table content would appear here after loading
            </p>
            <button
              onClick={() => setLoading(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Reload Skeleton
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
