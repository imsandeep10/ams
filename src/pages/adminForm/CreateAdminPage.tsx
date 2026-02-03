import { CreateAdminForm } from "@/components/admin/CreateAdminForm";
import React from "react";

export const CreateAdminPage = React.memo(() => {
  return (
    <div>
      <CreateAdminForm />
    </div>
  );
});

CreateAdminPage.displayName = "CreateAdminPage";
