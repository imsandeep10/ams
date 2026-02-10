import { DataTable } from "@/components/students/studentTables/DataTable";
import React, { useState } from "react";
import { PaymentColumn } from "./paymentColumn";
import { useGetAllPayments } from "@/lib/api/usePayment";
import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
import { useSearchParams } from "react-router-dom";
import { debounce } from "@tanstack/react-pacer";

const Payment: React.FC = React.memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page") ?? 1);
  const initialPageSize = Number(searchParams.get("limit") ?? 10);
  const search = searchParams.get("search") ?? "";
  const paymentFilter = searchParams.get("filter") ?? "all";

  const [filter, setFilter] = useState({
    page: initialPage,
    limit: initialPageSize,
    search: search,
    paymentStatus: paymentFilter,
  });

  const { data: paymentData, isPending } = useGetAllPayments(
    filter.page,
    filter.limit,
    filter.paymentStatus,
    filter.search,
  );

  const filterPaymentStatus = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Paid",
      value: "paid",
    },
    {
      label: "Unpaid",
      value: "unpaid",
    },
    {
      label: "Partial",
      value: "partial",
    },
  ];

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    console.log("Pagination changed:", { newPage, newPageSize });
    setFilter({
      page: newPage,
      limit: newPageSize,
      search: filter.search,
      paymentStatus: filter.paymentStatus,
    });
    setSearchParams({
      page: newPage.toString(),
      limit: newPageSize.toString(),
    });
  };

  const handleSearch = debounce(
    (search: string) => {
      setFilter({
        page: 1,
        limit: filter.limit,
        search,
        paymentStatus: filter.paymentStatus,
      });
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

  const handleFilterChange = (filter: string) => {
    setFilter({
      page: 1,
      limit: initialPageSize,
      search: search,
      paymentStatus: filter,
    });
    setSearchParams({
      page: "1",
      limit: initialPageSize.toString(),
      filter: filter,
    });
  };

  console.log(paymentData?.pagination);
  if (isPending) {
    return <DataTableSkeleton />;
  }

  return (
    <div>
      <DataTable
        columns={PaymentColumn}
        data={paymentData?.students || []}
        isPaymentFilter={true}
        pageCount={paymentData?.pagination?.totalPages || 1}
        pageIndex={paymentData?.pagination?.page || 1}
        pageSize={paymentData?.pagination?.limit || 10}
        totalRows={paymentData?.pagination?.total || 0}
        onPaginationChange={handlePaginationChange}
        isAddButton={false}
        onSearch={handleSearch}
        searchInputData={filter.search}
        filterLabel="Filter Payments"
        onFilterChange={handleFilterChange}
        filterData={filterPaymentStatus}
      />
    </div>
  );
});

export default Payment;
