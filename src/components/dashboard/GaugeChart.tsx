import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";

type GaugeChartProps = {
  labels?: string[];
  values?: number[];
  colors?: string[];
  title?: string;
  description?: string;
  footerText?: string;
  trend?: string;
};

export const GaugeChart: React.FC<GaugeChartProps> = ({
  labels = [],
  values = [],
  colors = [],
  title = "Donut Chart",
  description = "Overview",
  footerText = "Showing total values",
  trend = "Trending up",
}) => {
  // Prepare data dynamically with validation
  const data = labels.map((label, index) => ({
    name: label,
    value: values[index] ?? 0,
    color: colors[index] ?? "#4f46e5",
  }));

  const total = values.reduce((sum, val) => sum + (val ?? 0), 0);
  const hasData = total > 0;

  // Custom label renderer with better formatting
  const renderLabel = (props: any) => {
    const { name, value, cx, cy, midAngle, outerRadius } = props;

    if (!hasData || value === 0) return null;

    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percent = ((value / total) * 100).toFixed(1);

    return (
      <text
        x={x}
        y={y}
        fill="#374151"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${name}: ${value} (${percent}%)`}
      </text>
    );
  };

  // Determine trend icon
  const TrendIcon = trend?.toLowerCase().includes("down")
    ? TrendingDown
    : TrendingUp;
  const trendColor = trend?.toLowerCase().includes("down")
    ? "text-red-500"
    : "text-green-500";

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {!hasData ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <p>No data available</p>
          </div>
        ) : (
          <ChartContainer
            config={{}}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <Tooltip
                content={<ChartTooltipContent hideLabel />}
                formatter={(value: number, name: string) => [
                  `${value} (${((value / total) * 100).toFixed(1)}%)`,
                  name,
                ]}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                label={renderLabel}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => {
                  const itemValue = entry.payload?.value ?? 0;
                  const percent = hasData
                    ? ((itemValue / total) * 100).toFixed(1)
                    : "0.0";
                  return `${value}: ${itemValue} (${percent}%)`;
                }}
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      {hasData && (
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            {trend} <TrendIcon className={`h-4 w-4 ${trendColor}`} />
          </div>
          <div className="leading-none text-muted-foreground">{footerText}</div>
        </CardFooter>
      )}
    </Card>
  );
};
