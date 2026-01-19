import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const RemarkCard = React.memo(
  ({ remark, date, role }: { remark: string; date: string; role: string }) => {
    return (
      <Card className="gap-0 py-2 rounded-md border border-gray-300 shadow-xs">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="font-medium text-lg">{role}</CardTitle>
          <CardDescription className="text-gray-600">
            {new Date(date).toLocaleDateString("eng", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription>{remark}</CardDescription>
        </CardContent>
      </Card>
    );
  },
);

export default RemarkCard;
