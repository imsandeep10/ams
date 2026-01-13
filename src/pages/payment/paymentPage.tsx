import { DataTable } from "@/components/students/studentTables/DataTable";
import React, { useState } from "react";
import { PaymentColumn } from "./paymentColumn";
import { useGetAllStudents } from "@/lib/api/useStudents";
import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
import { useSearchParams } from "react-router-dom";

const Payment: React.FC = React.memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const paymentFilter = searchParams.get("filter") ?? "all";

  const [filter, setFilter] = useState({
    page,
    limit,
  });

  const { data: studentData, isPending } = useGetAllStudents(
    filter.page,
    filter.limit,
    paymentFilter === "all" ? undefined : paymentFilter
  );

  if (isPending) {
    return <DataTableSkeleton />;
  }

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setFilter({ page: newPage, limit: newPageSize });
    setSearchParams({
      page: newPage.toString(),
      limit: newPageSize.toString(),
    });
  };
  return (
    <div>
      <DataTable
        columns={PaymentColumn}
        data={[]}
        isPaymentFilter={true}
        pageCount={studentData?.pagination.totalPages || 1}
        pageIndex={studentData?.pagination.page || 0}
        pageSize={studentData?.pagination.limit || 10}
        totalRows={studentData?.pagination.total || 0}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
});

export default Payment;
