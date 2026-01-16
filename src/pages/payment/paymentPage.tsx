import { DataTable } from "@/components/students/studentTables/DataTable";
import React, { useState } from "react";
import { PaymentColumn } from "./paymentColumn";
import {useGetAllPayments} from "@/lib/api/usePayment";
import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
// import { useSearchParams } from "react-router-dom";

const Payment: React.FC = React.memo(() => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const page = Number(searchParams.get("page") ?? 1);
  // const limit = Number(searchParams.get("limit") ?? 10);
  // const paymentFilter = searchParams.get("filter") ?? "all";

  // const [filter, setFilter] = useState({
  //   page,
  //   limit,
  // });

  const { data: paymentData, isPending } = useGetAllPayments(
    // filter.page,
    // filter.limit,
    // paymentFilter === "all" ? undefined : paymentFilter
  );

  console.log("Payment Data:", paymentData);



  if (isPending) {
    return <DataTableSkeleton />;
  }

  // const handlePaginationChange = (newPage: number, newPageSize: number) => {
  //   setFilter({ page: newPage, limit: newPageSize });
  //   setSearchParams({
  //     page: newPage.toString(),
  //     limit: newPageSize.toString(),
  //   });
  // };
  return (
    <div>
      <DataTable
        columns={PaymentColumn}
        data={paymentData || []}
        isPaymentFilter={true}
        pageCount={paymentData?.pagination?.totalPages || 1}
        pageIndex={paymentData?.pagination?.page || 0}
        pageSize={paymentData?.pagination?.limit || 10}
        totalRows={paymentData?.pagination?.total || 0}
        // onPaginationChange={handlePaginationChange}
        isAddButton={false}
        addLink=""
        addLabel=""
      />
    </div>
  );
});

export default Payment;
