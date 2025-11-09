import { SidebarProvider } from "../ui/sidebar";
import { Outlet } from "react-router-dom";
import AppSidebar from "../appSidebar";
import { useAuthStore } from "@/lib/stores/AuthStore";
import { NavBar } from "../navigation/navBar";

export default function AppLayout() {
  const role = useAuthStore(state => state.role);

  return (
    <div className="h-full overflow-hidden flex">
      <SidebarProvider defaultOpen={true}>
        <div>
          <AppSidebar roleProp={role || undefined} />
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