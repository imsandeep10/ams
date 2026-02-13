import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
import { LangugaeColumns } from "@/components/students/languageTables/languageColumns";
import { DataTable } from "@/components/students/studentTables/DataTable";
import { useGetStudentsByLanguage } from "@/lib/api/useStudents";
import { useCurrentUser } from "@/lib/api/useUser";
import { Role } from "@/shared/interface/studentResponse";
import { debounce } from "@tanstack/react-pacer";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const DuolingoPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = Number(searchParams.get("page")) || 1;
  const initialPageSize = Number(searchParams.get("limit")) || 10;
  const initialSearch = searchParams.get("student") || "";
  const [filter, setFilter] = useState({
    page: initialPage,
    limit: initialPageSize,
    search: initialSearch,
  });

  const { data: currentUser } = useCurrentUser();
  const { data, isPending } = useGetStudentsByLanguage(
    "Duolingo",
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
      <DataTable
        columns={LangugaeColumns}
        isMessaging={true}
        data={data?.students || []}
        pageCount={data?.pagination.totalPages || 1}
        pageIndex={initialPage}
        pageSize={initialPageSize}
        totalRows={data?.pagination.total || 0}
        onPaginationChange={handlePaginationChange}
        onSearch={handleSearch}
        searchInputData={filter.search}
        addLink={"create?language=Duolingo"}
        isAddButton={currentUser?.data.role !== Role.ACCOUNTANT}
      />
    </div>
  );
};

DuolingoPage.displayName = "DuolingoPage";

export default React.memo(DuolingoPage);
