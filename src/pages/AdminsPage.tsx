import React from "react";
import { useGetAllAdmins } from "@/lib/api/useAdmin";
import { DataTableSkeleton } from "@/components/common/DataTableSkeleton";
import { AdminDataTable } from "@/admins/AdminDataTable";
import { AdminColumn } from "@/admins/AdminColumn";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminPage: React.FC = () => {
  const { data: admins, isPending, error } = useGetAllAdmins();
  const navigate = useNavigate();
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
      <div className="w-full flex items-end justify-end">
        <Button
          onClick={() => navigate("/Password-admin")}
          className="cursor-pointer"
        >
          Change Admin Password
        </Button>
      </div>
      <AdminDataTable columns={AdminColumn} data={admins} />
    </div>
  );
};

AdminPage.displayName = "AdminPage";

export default React.memo(AdminPage);
