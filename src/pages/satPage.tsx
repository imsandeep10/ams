import React from "react";
import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
import { columns } from "@/components/students/studentTables/Columns";
import { DataTable } from "@/components/students/studentTables/DataTable";
import { useGetStudentsByLanguage } from "@/lib/api/useStudents";

const SatPage: React.FC = () => {
  const { data: students, isPending } = useGetStudentsByLanguage("SAT");

  if (isPending) {
    return (
      <>
        <DataTableSkeleton rows={8} />
      </>
    );
  }

  return (
    <div className="container mx-auto py-2">
      <DataTable columns={columns} data={students || []} />
    </div>
  );
};

SatPage.displayName = "SatPage";

export default React.memo(SatPage);
