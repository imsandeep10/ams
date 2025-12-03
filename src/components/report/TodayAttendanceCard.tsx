import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Language } from "@/types/languageType";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TodayAttendanceCardProps {
  year: number;
  month: number;
  selectedLanguage?: Language["language"];
  onLanguageChange?: (language: Language["language"]) => void;
  showLanguageSelector?: boolean;
}

export const TodayAttendanceCard: React.FC<TodayAttendanceCardProps> = ({
  year,
  month,
  selectedLanguage = "IELTS",
  onLanguageChange,
  showLanguageSelector = true,
}) => {
 



  const monthName = new Date(year, month - 1).toLocaleString("default", {
    month: "long",
  });


  return (
    <Card className="w-full shadow-md border border-gray-200 bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Daily Attendance Trend
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {monthName} {year} - Day by day attendance
            </p>
          </div>
          {showLanguageSelector && (
            <Select value={selectedLanguage} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IELTS">IELTS</SelectItem>
                <SelectItem value="PTE">PTE</SelectItem>
                <SelectItem value="SAT">SAT</SelectItem>
                <SelectItem value="DUOLINGO">Duolingo</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
       
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              label={{
                value: `Day of ${monthName}`,
                position: "insideBottom",
                offset: -5,
              }}
              stroke="#6b7280"
            />
            <YAxis
              label={{
                value: "Number of Students",
                angle: -90,
                position: "insideLeft",
              }}
              stroke="#6b7280"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "12px",
              }}
              formatter={(value: any, name: string) => {
                return [value, name];
              }}
              labelFormatter={(label) => `Day ${label}`}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
              }}
            />
            <Line
              type="monotone"
              dataKey="Total"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6 }}
              name="Total Students"
            />
            <Line
              type="monotone"
              dataKey="Present"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", r: 4 }}
              activeDot={{ r: 6 }}
              name="Present"
            />
            <Line
              type="monotone"
              dataKey="Absent"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: "#ef4444", r: 4 }}
              activeDot={{ r: 6 }}
              name="Absent"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default React.memo(TodayAttendanceCard);
