import { EditAdminForm } from "@/components/admin/EditAdminForm";
import React from "react";

export const EditAdminPage = React.memo(() => {
  return (
    <>
      <div>
        <EditAdminForm />
      </div>
    </>
  );
});
EditAdminPage.displayName = "EditAdminPage";
