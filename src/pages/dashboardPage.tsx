import React from "react";
import { TotalCard } from "@/components/dashboard/TotalCard";
import { Calendar } from "@/components/ui/calendar";
import StaticQRCode from "@/components/dashboard/GlobalQRCode";
import StudentRegistrationQRCode from "@/components/dashboard/StudentRegistrationQRCode";
import TodayPresentTable from "@/components/dashboard/TodayPresentTable";

const DashboardPage = React.memo(() => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="w-full p-4 md:p-6 lg:p-8">
      {/* Top Section - Stats and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Stats and Bar Chart */}
        <div className="lg:col-span-2 space-y-6">
          <TotalCard />
        </div>

        {/* Right Column - Gauge and Calendar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex justify-center lg:justify-start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg border shadow-sm w-full"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section - Data Table */}
      <div className="w-full">
        <TodayPresentTable />
      </div>

      {/* QR Codes Section - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <StaticQRCode />
        <StudentRegistrationQRCode />
      </div>


    </div>
  );
});

DashboardPage.displayName = "DashboardPage";
export default DashboardPage;