import { SidebarProvider } from "../ui/sidebar";
import { Outlet } from "react-router-dom";
import AppSidebar from "../appSidebar";
import { NavBar } from "../navigation/navBar";
import { useCurrentUser } from "@/lib/api/useUser";

export default function AppLayout() {
  const { data: currentUser, isPending: isLoading } = useCurrentUser();

  if (isLoading) {
    return <div>Loading...</div>;
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
