import { CreateAdminForm } from "@/components/createa-admin/CreateAdminForm";
import React from "react";

export const CreateAdminPage = React.memo(() => {
  return (
    <div>
      <CreateAdminForm mode="create" />
    </div>
  );
});

CreateAdminPage.displayName = "CreateAdminPage";
