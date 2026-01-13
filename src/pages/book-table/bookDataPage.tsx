// import { DataTable } from "@/components/students/studentTables/DataTable";
import React from "react";
// import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
// import { useSearchParams } from "react-router-dom";
// import { BookColumn } from "./bookColumn";
// import { useGetBook } from "@/lib/api/useBooks";

const Payment: React.FC = React.memo(() => {
//   const [searchParams, setSearchParams] = useSearchParams();

//   const page = Number(searchParams.get("page") ?? 1);
//   const limit = Number(searchParams.get("limit") ?? 10);

//   const [filter, setFilter] = useState({
//     page,
//     limit,
//   });

//   const { data: studentData, isPending } = useGetBook(
//     filter.page,
//     filter.limit
//   );

//   if (isPending) {
//     return <DataTableSkeleton />;
//   }

//   const handlePaginationChange = (newPage: number, newPageSize: number) => {
//     setFilter({ page: newPage, limit: newPageSize });
//     setSearchParams({
//       page: newPage.toString(),
//       limit: newPageSize.toString(),
//     });
//   };
  return (
    <div>
      {/* <DataTable
        columns={BookColumn}
        data={[]}
        pageCount={studentData?.pagination.totalPages || 1}
        pageIndex={studentData?.pagination.page || 0}
        pageSize={studentData?.pagination.limit || 10}
        totalRows={studentData?.pagination.total || 0}
        // onPaginationChange={handlePaginationChange}
        isAddButton={false}
        addLink=""
        addLabel=""
      /> */}
    </div>
  );
});

export default Payment;
