import { DataTable } from "@/components/students/studentTables/DataTable";
import React, { useState } from "react";
import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
import { BookColumn } from "./bookColumn";
import { useGetBook } from "@/lib/api/useBook";
import { useSearchParams } from "react-router-dom";
import { debounce } from "@tanstack/react-pacer";

const bookPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialPageSize = parseInt(searchParams.get("limit") || "10", 10);
  const intialSearch = searchParams.get("search") || "";

  const [filter, setFilter] = useState({
    page: initialPage,
    limit: initialPageSize,
    search: intialSearch,
  });

  const { data, isPending, error } = useGetBook(
    filter.page,
    filter.limit,
    filter.search,
  );

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setFilter({
      page: newPage,
      limit: newPageSize,
      search: filter.search,
    });
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

  // Loading state
  if (isPending) {
    return <DataTableSkeleton rows={8} />;
  }

  return (
    <div className="container mx-auto py-2">
      <DataTable
        columns={BookColumn}
        data={data?.students || []}
        pageCount={data?.pagination?.totalPages || 1}
        pageIndex={initialPage}
        pageSize={initialPageSize}
        totalRows={data?.pagination?.total || 0}
        onPaginationChange={handlePaginationChange}
        isAddButton={false}
        onSearch={handleSearch}
        searchInputData={filter.search}
        errorMessage={error?.message || "No result found"}
      />
    </div>
  );
};

export default bookPage;
