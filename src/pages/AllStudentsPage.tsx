import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
import { columns } from "@/components/students/studentTables/Columns";
import { DataTable } from "@/components/students/studentTables/DataTable";
import { useGetAllStudents } from "@/lib/api/useStudents";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { debounce } from "@tanstack/react-pacer";
import {
  StudentFilter,
  type StudentFilterValues,
} from "@/components/students/studentTables/studentFilter";

const AllStudentsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page") ?? 1);
  const initialPageSize = Number(searchParams.get("limit") ?? 10);
  const initialSearch = searchParams.get("student") ?? "";

  // Get filter values from URL
  const initialFilters: StudentFilterValues = {
    language: searchParams.get("language") || undefined,
    preferredCountry: searchParams.get("preferredCountry") || undefined,
    yearOfCompletion: searchParams.get("yearOfCompletion") || undefined,
    includeQrCode: searchParams.get("includeQrCode") === "true",
  };

  const [filter, setFilter] = useState({
    page: initialPage,
    limit: initialPageSize,
    search: initialSearch,
    ...initialFilters,
  });

  const { data, isPending } = useGetAllStudents(
    filter.page,
    filter.limit,
    filter.search,
    filter.language,
    filter.preferredCountry,
    filter.yearOfCompletion,
    filter.includeQrCode || undefined,
  );

  const updateSearchParams = (updates: Partial<typeof filter>) => {
    const newParams: Record<string, string> = {};
    const finalFilter = { ...filter, ...updates };

    // Always include page and limit
    newParams.page = finalFilter.page.toString();
    newParams.limit = finalFilter.limit.toString();

    // Add search if present
    if (finalFilter.search) {
      newParams.student = finalFilter.search;
    }

    // Add filter params if present
    if (finalFilter.language) newParams.language = finalFilter.language;
    if (finalFilter.preferredCountry)
      newParams.preferredCountry = finalFilter.preferredCountry;
    if (finalFilter.yearOfCompletion)
      newParams.yearOfCompletion = finalFilter.yearOfCompletion;
    if (finalFilter.includeQrCode) newParams.includeQrCode = "true";

    setSearchParams(newParams);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    const updates = { page: newPage, limit: newPageSize };
    setFilter((prev) => ({ ...prev, ...updates }));
    updateSearchParams(updates);
  };

  const handleSearch = debounce(
    (search: string) => {
      const updates = { page: 1, search };
      setFilter((prev) => ({ ...prev, ...updates }));
      updateSearchParams(updates);
    },
    {
      wait: 500,
    },
  );

  const handleFilterChange = (filterValues: StudentFilterValues) => {
    const updates = { page: 1, ...filterValues };
    setFilter((prev) => ({ ...prev, ...updates }));
    updateSearchParams(updates);
  };

  if (isPending) {
    return (
      <>
        <DataTableSkeleton rows={8} />
      </>
    );
  }

  return (
    <div className="container mx-auto py-2">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All Enrolled Students</h1>
        <StudentFilter
          onFilterChange={handleFilterChange}
          initialFilters={{
            language: filter.language,
            preferredCountry: filter.preferredCountry,
            yearOfCompletion: filter.yearOfCompletion,
            includeQrCode: filter.includeQrCode,
          }}
        />
      </div>
      <DataTable
        columns={columns}
        data={data?.students || []}
        pageCount={data?.pagination.totalPages || 1}
        pageIndex={initialPage - 1}
        pageSize={initialPageSize}
        totalRows={data?.students.length || 0}
        onPaginationChange={handlePaginationChange}
        onSearch={handleSearch}
        searchInputData={filter.search}
      />
    </div>
  );
};

AllStudentsPage.displayName = "AllStudentsPage";

export default React.memo(AllStudentsPage);
