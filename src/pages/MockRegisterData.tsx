import React from "react";
import { useGetMockPast, useGetMockUpcoming } from "@/lib/api/useMockRegister";
import { MockColumnUpcoming } from "@/components/mock-test/MockColumnUpcoming";
import { MockDataTableUpcoming } from "@/components/mock-test/MockDataTableUpcoming";
import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
import { Users } from "lucide-react";
import { MockDataTablePast } from "@/components/mock-test/MockDataTablePast";
import { MockColumnPast } from "@/components/mock-test/MockColumnPast";

const MockRegisterData: React.FC = () => {
  const { data: mockUpcoming, isPending, error } = useGetMockUpcoming();
  const { data: mockPast, isLoading, isError } = useGetMockPast();

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

  const mockArrayUpcoming = Array.isArray(mockUpcoming) ? mockUpcoming : [];
  const mockArrayPast = Array.isArray(mockPast) ? mockPast : [];

  return (
    <div className="container mx-auto py-6 space-y-10">
      {/* Upcoming Section */}
      <section>
        {mockArrayUpcoming.length > 0 ? (
          <MockDataTableUpcoming
            columns={MockColumnUpcoming}
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

      {/* Past Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Past Mock Test Students</h2>
        {mockArrayPast.length > 0 ? (
          <MockDataTablePast columns={MockColumnPast} data={mockArrayPast} />
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
