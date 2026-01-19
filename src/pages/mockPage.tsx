import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
import { columnsMockTest } from "@/components/mock-test/mockColumns";
import { DataTable } from "@/components/students/studentTables/DataTable";
import { upcomingMockTest } from "@/lib/api/useMockRegister";
import React, { useState } from "react";
import { CalendarIcon, CheckCircle } from "lucide-react";
import { StatsCard } from "@/components/recordCards/Card";

const MockPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInputData, setSearchInputData] = useState("");
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

  const statsData = [
    {
      title: "Total Students",
      icon: CalendarIcon,
      value: data?.data.length || 0,
      borderColor: "border-l-blue-500",
      textColor: "text-gray-900",
    },
    {
      title: "Total Speaking",
      icon: CheckCircle,
      value: data?.numberOfStudentsInEachModule.totalSpeaking || 0,
      borderColor: "border-l-[#22C55E]",
      textColor: "text-[#22C55E]",
    },
    {
      title: "Total Listening",
      icon: CheckCircle,
      value: data?.numberOfStudentsInEachModule.totalListening || 0,
      borderColor: "border-l-[#22C55E]",
      textColor: "text-[#22C55E]",
    },
    {
      title: "Total Writing",
      icon: CheckCircle,
      value: `${data?.numberOfStudentsInEachModule.totalWriting || 0}`,
      borderColor: "border-l-[#22C55E]",
      textColor: "text-[#22C55E]",
    },
    {
      title: "Total Reading",
      icon: CheckCircle,
      value: `${data?.numberOfStudentsInEachModule.totalReading || 0}`,
      borderColor: "border-l-[#22C55E]",
      textColor: "text-[#22C55E]",
    },
  ];

  return (
    <div className="container mx-auto py-2">
      {/* stats cards */}
      {data && data.data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {statsData.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              icon={stat.icon}
              value={stat.value}
              borderColor={stat.borderColor}
              textColor={stat.textColor}
            />
          ))}
        </div>
      )}
      <DataTable
        columns={columnsMockTest}
        data={data?.data || []}
        pageCount={data?.pagination.totalPages || 1}
        pageIndex={page - 1}
        pageSize={pageSize}
        totalRows={data?.pagination.total || 0}
        onPaginationChange={handlePaginationChange}
        addLink="mock-test/register"
        addLabel="Add Mock Test"
        isExport={true}
        isDateFilter={true}
        onSearch={(search: string) => setSearchInputData(search)}
        searchInputData={searchInputData}
      />
    </div>
  );
};

MockPage.displayName = "MockPage";

export default React.memo(MockPage);
