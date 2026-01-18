import { DataTable } from "@/components/students/studentTables/DataTable";
import React,{useState} from "react";
import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
import { BookColumn } from "./bookColumn";
import { useGetBook } from "@/lib/api/useBook";

const bookPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isPending } = useGetBook(page, pageSize);
  console.log("Book Data:", data);

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
          columns={BookColumn}
          data={data || []}
          pageCount={data?.pagination?.totalPages || 1}
          pageIndex={page - 1}
          pageSize={pageSize}
          totalRows={data?.pagination?.total || 0}
          onPaginationChange={handlePaginationChange}
          addLink=""
          addLabel=""
          isAddButton={false}
        />
      </div>
  );
};

export default bookPage;
