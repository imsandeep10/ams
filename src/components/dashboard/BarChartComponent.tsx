import type { barChartTypes } from "@/types/barChartTypes";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

type Props = {
  data: barChartTypes[];
};

const  BarChartComponent: React.FC<Props> = React.memo(({ data }) => {
  return (
    <div className="bg-white  rounded-md w-full  ">
      <div className="py-4 flex flex-row justify-between">
        <div>
          <span className="px-8 py-4 text-xl font-semibold">
            Class Wise Attendence(%)
          </span>
        </div>
        <div className="flex flex-row items-center gap-5 pr-3">
          <div className="flex flex-row items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-muted"></div>
            <span className="text-md font-semibold">Daily</span>
          </div>
          <div className="flex flex-row items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-muted"></div>
            <span className="text-md font-semibold">Monthly</span>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <p className="flex flex-row items-center text-md font-semibold">
                  This year
                  <span>
                    <ChevronDown size={16} />
                  </span>
                </p>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Last Year</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div>
        <BarChart width={600} height={300} data={data}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="daily" fill="#A5D6A7" barSize={30} />
          <Bar dataKey="monthly" fill="#1B5E20" barSize={30} />
        </BarChart>
      </div>
    </div>
  );
});

BarChartComponent.displayName = "BarChartComponent";

export default BarChartComponent;
