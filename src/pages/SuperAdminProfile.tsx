import { useAuthStore } from "@/lib/stores/AuthStore";
import React from "react";

export const SuperAdminProfile = React.memo(() => {
  const { user } = useAuthStore();
  console.log("user is", user);
  return (
    <div>
      <h1>This is supeprofile page</h1>
    </div>
  );
});
SuperAdminProfile.displayName = "SuperAdminProfile";
