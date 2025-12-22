import React, { useMemo, useState } from "react";
import { useGetMockPast, useGetMockUpcoming } from "@/lib/api/useMockRegister";
import { getMockColumnUpcoming } from "@/components/mock-test/MockColumnUpcoming";
import { MockDataTableUpcoming } from "@/components/mock-test/MockDataTableUpcoming";
import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
import { Users } from "lucide-react";
import { MockDataTablePast } from "@/components/mock-test/MockDataTablePast";
import { getMockColumnPast } from "@/components/mock-test/MockColumnPast";

const MockRegisterData: React.FC = () => {
  const [pastPage, setPastPage] = useState(1);
  const pastLimit = 10;

  const { data: mockUpcoming, isPending, error } = useGetMockUpcoming();
  const { data: mockPast, isLoading, isError } = useGetMockPast(pastPage, pastLimit);
  
  console.log("MockRegisterData render", mockPast);

  const columnsUpcoming = useMemo(() => getMockColumnUpcoming(), []);
  const columnsPast = useMemo(() => getMockColumnPast(), []);

  if (isPending || isLoading) {
    return <DataTableSkeleton rows={4} />;
  }

  if (error || isError) {
    return (
      <div className="container mx-auto py-2">
        <div className="p-4 text-red-500">
          Error loading Mock student: {error?.message || "Something went wrong"}
        </div>
      </div>
    );
  }

  // Extract the data array from the paginated response
  const mockArrayUpcoming = Array.isArray(mockUpcoming) 
    ? mockUpcoming 
    : (mockUpcoming?.data && Array.isArray(mockUpcoming.data)) 
      ? mockUpcoming.data 
      : [];
      
  const mockArrayPast = Array.isArray(mockPast)
    ? mockPast
    : (mockPast?.data && Array.isArray(mockPast.data))
      ? mockPast.data
      : [];

  const pastPagination = !Array.isArray(mockPast) ? mockPast?.pagination : undefined;

  return (
    <div className="container mx-auto py-6 space-y-10">
      {/* Upcoming Section */}
      <section>
        {mockArrayUpcoming.length > 0 ? (
          <MockDataTableUpcoming
            columns={columnsUpcoming}
            data={mockArrayUpcoming}
          />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Upcoming Students
            </h3>
            <p className="text-gray-500 mb-6">
              No students have registered for upcoming mock tests yet.
            </p>
          </div>
        )}
      </section>

      <section>
        {mockArrayPast.length > 0 ? (
          <MockDataTablePast
            columns={columnsPast}
            data={mockArrayPast}
            pagination={
              pastPagination
                ? {
                    total: pastPagination.total ?? mockArrayPast.length,
                    totalPages: pastPagination.totalPages ?? 1,
                    page: pastPagination.page ?? pastPage,
                    limit: pastPagination.limit ?? pastLimit,
                  }
                : undefined
            }
            onPageChange={setPastPage}
          />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Past Students Found
            </h3>
          </div>
        )}
      </section>
    </div>
  );
};

MockRegisterData.displayName = "MockRegisterData";

export default React.memo(MockRegisterData);