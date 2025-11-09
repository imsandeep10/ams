import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
import { columns } from "@/components/students/studentTables/Columns";
import { DataTable } from "@/components/students/studentTables/DataTable";
import { useGetStudentsByLanguage } from "@/lib/api/useStudents";
import React from "react";

const DuolingoPage: React.FC = () => {
  const { data: students, isPending } = useGetStudentsByLanguage("DUOLINGO");

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

DuolingoPage.displayName = "DuolingoPage";

export default React.memo(DuolingoPage);
