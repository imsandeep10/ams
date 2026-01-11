import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

const RemarkCard = React.memo(() => {
  return (
    <Card className="gap-0">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl font-medium">
          Speaking Improvement
        </CardTitle>
        <Badge className="py-1 px-4 text-md">Progress</Badge>
      </CardHeader>
      <CardContent className="gap-0">
        <p className="text-gray-500 line-clamp-1">hello</p>
        <p className="text-gray-700 line-clamp-4">hello</p>
      </CardContent>
    </Card>
  );
});

export default RemarkCard;
