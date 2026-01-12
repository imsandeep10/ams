import { SidebarProvider } from "../ui/sidebar";
import { Outlet } from "react-router-dom";
import AppSidebar from "../appSidebar";
import { NavBar } from "../navigation/navBar";
import { useCurrentUser } from "@/lib/api/useUser";
import { Skeleton } from "../ui/skeleton";

export default function AppLayout() {
  const { data: currentUser, isPending: isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="h-full overflow-hidden flex">
        <div className="w-64 border-r bg-background p-4 space-y-4">
          <Skeleton className="h-8 w-32" />
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="flex flex-col w-full h-screen">
          <div className="border-b p-4">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex-1 p-5 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden flex">
      <SidebarProvider defaultOpen={true}>
        <div>
          <AppSidebar roleProp={currentUser?.role || undefined} />
        </div>
        <div className="flex flex-col w-full h-screen overflow-hidden">
          <NavBar />
          <div className="flex-1 overflow-auto">
            <div className="p-5">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
