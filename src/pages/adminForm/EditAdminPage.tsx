import { CreateAdminForm } from "@/components/create-admin/CreateAdminForm";
import React from "react";

export const EditAdminPage = React.memo(() => {
  return (
    <>
      <div>
        <CreateAdminForm mode="edit" />
      </div>
    </>
  );
});
EditAdminPage.displayName = "EditAdminPage";
