import { DataTable } from "@/components/students/studentTables/DataTable";
import React from "react";
import { PaymentColumn } from "./paymentColumn";
import { useGetAllStudents } from "@/lib/api/useStudents";

const Payment: React.FC = React.memo(() => {
  const { data: studentData } = useGetAllStudents();
  return (
    <div>
      <DataTable columns={PaymentColumn} data={studentData?.students} />
    </div>
  );
});

export default Payment;
