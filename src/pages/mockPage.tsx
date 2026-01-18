import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
import { columnsMockTest } from "@/components/mock-test/mockColumns";
import { DataTable } from "@/components/students/studentTables/DataTable";
import { upcomingMockTest } from "@/lib/api/useMockRegister";
import React, { useState } from "react";
import { useExportMockTests } from "@/lib/api/useMockRegister";
// import { StatsCard } from "@/components/recordCards/Card";
// import { CalendarIcon } from "lucide-react";

const MockPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { mutate: handleExport, isPending: isExporting } = useExportMockTests();

  const { data, isPending } = upcomingMockTest(page, pageSize);

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

  // const statsData = [
  //   {
  //     title: "Total Students",
  //     icon: CalendarIcon,
  //     value: attendanceRecord?.summary.totalDays || 0,
  //     borderColor: "border-l-blue-500",
  //     textColor: "text-gray-900",
  //   },
  //   {      title: "Present Days",
  //     icon: CheckCircle,
  //     value: attendanceRecord?.summary.presentDays || 0,
  //     borderColor: "border-l-green-500",
  //     textColor: "text-green-600",
  //   },
  //   {
  //     title: "Absent Days",
  //     icon: CheckCircle,
  //     value: attendanceRecord?.summary.absentDays || 0,
  //     borderColor: "border-l-red-500",
  //     textColor: "text-red-600",
  //   },
  //   {
  //     title: "Attendance Rate",
  //     icon: CheckCircle,
  //     value: `${attendanceRecord?.summary.attendancePercentage.toFixed(1) || 0}%`,
  //     borderColor: "border-l-purple-500",
  //     textColor: "text-purple-600",
  //   }
  //   {
  //     title: "Attendance Rate",
  //     icon: CheckCircle,
  //     value: `${attendanceRecord?.summary.attendancePercentage.toFixed(1) || 0}%`,
  //     borderColor: "border-l-purple-500",
  //     textColor: "text-purple-600",
  //   }
  // ]

  return (
    <div>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            icon={stat.icon}
            value={stat.value}
            subtext={stat.subtext}
            borderColor={stat.borderColor}
            textColor={stat.textColor}
          />
        ))}
      </div> */}
      <div className="container mx-auto py-2">
        <DataTable
          columns={columnsMockTest}
          data={data?.data || []}
          pageCount={data?.pagination.totalPages || 1}
          pageIndex={page - 1}
          pageSize={pageSize}
          totalRows={data?.pagination.total || 0}
          onPaginationChange={handlePaginationChange}
          addLink="/mock-table/mock-test/register"
          addLabel="Add Mock Test"
          onExport={handleExport}
          isExporting={isExporting}
        />
      </div>
    </div>
  );
};

MockPage.displayName = "MockPage";

export default React.memo(MockPage);
