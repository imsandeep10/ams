import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
import { columnsMockTest } from "@/components/mock-test/mockColumns";
import { DataTable } from "@/components/students/studentTables/DataTable";
import { upcomingMockTest } from "@/lib/api/useMockRegister";
import React, { useState } from "react";

const MockPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isPending } = upcomingMockTest(page, pageSize);

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
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
      <DataTable
        columns={columnsMockTest}
        data={data?.data || []}
        pageCount={data?.pagination.totalPages || 1}
        pageIndex={page - 1}
        pageSize={pageSize}
        totalRows={data?.pagination.total || 0}
        onPaginationChange={handlePaginationChange}
        addLink="/mock-test/register"
        addLabel="Add Mock Test"
        isExport={true}
        isDateFilter={true}
      />
    </div>
  );
};

MockPage.displayName = "MockPage";

export default React.memo(MockPage);
