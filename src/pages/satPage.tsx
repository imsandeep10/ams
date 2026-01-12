import React, { useState } from "react";
import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
import { columns } from "@/components/students/studentTables/Columns";
import { DataTable } from "@/components/students/studentTables/DataTable";
import { useGetStudentsByLanguage } from "@/lib/api/useStudents";

const SatPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isPending } = useGetStudentsByLanguage("SAT", page, pageSize);

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
        columns={columns}
        isMessaging={true}
        data={data?.students || []}
        pageCount={data?.pagination.totalPages || 1}
        pageIndex={page - 1}
        pageSize={pageSize}
        totalRows={data?.pagination.total || 0}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
};

SatPage.displayName = "SatPage";

export default React.memo(SatPage);
