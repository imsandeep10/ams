import React from "react";
import { useGetAllAdmins } from "@/lib/api/useAdmin";
import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
import { AdminDataTable } from "@/admins/AdminDataTable";
import { AdminColumn } from "@/admins/AdminColumn";

const AdminPage: React.FC = () => {
  const { data: admins, isPending, error } = useGetAllAdmins();
  console.log(admins)
  if (isPending) {
    return (
      <>
        <DataTableSkeleton rows={4} />
      </>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-2">
        <div className="p-4 text-red-500">
          Error loading admins: {error.message}
        </div>
      </div>
    );
  }

  const adminsArray = Array.isArray(admins) ? admins : [];

  if (adminsArray.length === 0) {
    return (
      <div className="container mx-auto py-2">
        <div className="p-4 text-gray-500">No admins found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-2">
      <AdminDataTable columns={AdminColumn} data={admins} />
    </div>
  );
};

AdminPage.displayName = "AdminPage";

export default React.memo(AdminPage);
