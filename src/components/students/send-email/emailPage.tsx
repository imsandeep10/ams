import BackButton from "@/components/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const EmailPage: React.FC = React.memo(() => {
  return (
    <div>
      <BackButton />

      <Card>
        <CardHeader>
          <CardTitle>Write an Email</CardTitle>
        </CardHeader>
        <CardContent>{/* Email form components go here */}</CardContent>
      </Card>
    </div>
  );
});

export default EmailPage;
