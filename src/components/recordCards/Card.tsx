import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideProps } from "lucide-react";

interface CardProps {
  title: string;
  icon: React.ComponentType<LucideProps>;
  value: string | number;
  subtext?: string;
  borderColor?: string;
  textColor?: string;
}

export const StatsCard: React.FC<CardProps> = ({
  title,
  icon: Icon,
  value,
  subtext,
  borderColor,
  textColor = "text-black",
}: CardProps) => {
  return (
    <Card className={`border-l-4 ${borderColor} hover:shadow-lg transition-shadow`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <Icon className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${textColor} dark:text-white`}>
          {value}
        </div>
        {subtext && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {subtext}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
