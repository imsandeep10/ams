import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
import { columns } from "@/components/students/studentTables/Columns";
import { DataTable } from "@/components/students/studentTables/DataTable";
import { useGetAllStudents } from "@/lib/api/useStudents";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { debounce } from "@tanstack/react-pacer";

const AllStudentsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page") ?? 1);
  const initialPageSize = Number(searchParams.get("limit") ?? 10);
  const initialSearch = searchParams.get("student") ?? "";
  const [filter, setFilter] = useState({
    page: initialPage,
    limit: initialPageSize,
    search: initialSearch,
  });

  const { data, isPending } = useGetAllStudents(
    filter.page,
    filter.limit,
    filter.search,
  );

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setFilter({ page: newPage, limit: newPageSize, search: filter.search });
    setSearchParams({
      page: newPage.toString(),
      limit: newPageSize.toString(),
    });
  };

  const handleSearch = debounce(
    (search: string) => {
      setFilter({ page: 1, limit: filter.limit, search });
      setSearchParams({
        page: "1",
        limit: filter.limit.toString(),
        student: search,
      });
    },
    {
      wait: 500,
    },
  );

  if (isPending) {
    return (
      <>
        <DataTableSkeleton rows={8} />
      </>
    );
  }

  return (
    <div className="container mx-auto py-2">
      <h1 className="text-2xl font-bold mb-4">All Enrolled Students</h1>
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
