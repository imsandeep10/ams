import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
import { LangugaeColumns } from "@/components/students/languageTables/languageColumns";
import { DataTable } from "@/components/students/studentTables/DataTable";

import { useGetStudentsByLanguage } from "@/lib/api/useStudents";

import React, { useState } from "react";

const IeltsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isPending } = useGetStudentsByLanguage("IELTS", page, pageSize);
  console.log("IELTS Data:", data);

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
        columns={LangugaeColumns}
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

IeltsPage.displayName = "IeltsPage";

export default React.memo(IeltsPage);
