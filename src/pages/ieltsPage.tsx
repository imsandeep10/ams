import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
import { columns } from "@/components/students/studentTables/Columns";
import { DataTable } from "@/components/students/studentTables/DataTable";

import { useGetStudentsByLanguage } from "@/lib/api/useStudents";

import React from "react";

const IeltsPage: React.FC = () => {
  const { data: students, isPending } = useGetStudentsByLanguage("IELTS");
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

IeltsPage.displayName = "IeltsPage";

export default React.memo(IeltsPage);
