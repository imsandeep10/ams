import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { roleSidebars, sideBar } from "@/constant/sideBar";

interface SidebarProps {
  children: React.ReactNode;
  collapsed: boolean;
}

const Sidebar = ({ children, collapsed }: SidebarProps) => (
  <aside
    className={`${
      collapsed ? "w-16" : "w-64"
    } transition-all duration-300 ease-in-out bg-primary h-screen flex flex-col`}
  >
    {children}
  </aside>
);

interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

const SidebarContent = ({ children, className }: SidebarContentProps) => (
  <div className={className}>{children}</div>
);

interface SidebarGroupProps {
  children: React.ReactNode;
}

const SidebarGroup = ({ children }: SidebarGroupProps) => (
  <div className="flex-1">{children}</div>
);

interface SidebarGroupLabelProps {
  children: React.ReactNode;
  className?: string;
  collapsed: boolean;
}

const SidebarGroupLabel = ({
  children,
  className,
  collapsed,
}: SidebarGroupLabelProps) => (
  <div className={className}>{!collapsed && children}</div>
);

interface SidebarGroupContentProps {
  children: React.ReactNode;
  className?: string;
}

const SidebarGroupContent = ({
  children,
  className,
}: SidebarGroupContentProps) => <div className={className}>{children}</div>;

interface SidebarMenuProps {
  children: React.ReactNode;
}

const SidebarMenu = ({ children }: SidebarMenuProps) => (
  <ul className="space-y-2">{children}</ul>
);

interface SidebarMenuItemProps {
  children: React.ReactNode;
}

const SidebarMenuItem = ({ children }: SidebarMenuItemProps) => (
  <li>{children}</li>
);

interface SidebarMenuButtonProps {
  children: React.ReactNode;
  className?: string;
  collapsed: boolean;
  isActive: boolean;
}

const SidebarMenuButton = ({
  children,
  className,
  collapsed,
  isActive,
}: SidebarMenuButtonProps) => (
  <button
    className={`${className} ${collapsed ? "justify-center" : ""} ${
      isActive ? "bg-white text-black" : "hover:bg-white hover:text-black"
    } transition-colors`}
  >
    {children}
  </button>
);

const AppSidebar = ({ roleProp }: { roleProp?: string }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const isActiveRoute = (url: string) => {
    const searchParams = new URLSearchParams(location.search);
    const languageParam = searchParams.get("language")?.toLowerCase();
    const currentPath = location.pathname;

    // Extract language from sidebar URL (e.g., '/ielts' -> 'ielts')
    const menuLanguage = url.replace("/", "").toLowerCase();

    // Exact match for the pathname
    if (currentPath === url) {
      return true;
    }

    // Check for routes with language query parameter
    if (
      languageParam &&
      (currentPath === "/create-student" ||
        currentPath.startsWith("/edit-student/"))
    ) {
      return languageParam === menuLanguage;
    }

    // Check for routes that start with the menu URL (for nested routes with IDs)
    // e.g., /student-track should match when on /student-track
    // or /student-profile should match when on /student-profile/:id
    if (url !== "/" && currentPath.startsWith(url)) {
      return true;
    }

    return false;
  };
  // Use roleProp directly from AuthStore (already decoded)
  const effectiveRole = roleProp || "superAdmin"; // fallback to superAdmin if no role
  const items = (effectiveRole && roleSidebars[effectiveRole]) || sideBar;

  return (
    <div className="min-h-0">
      <Sidebar collapsed={collapsed}>
        <SidebarContent className="bg-primary text-white flex flex-col justify-between overflow-y-scroll scrollbar-hide">
          <div>
            <div className="flex items-center justify-between px-4 py-5">
              <SidebarGroupLabel
                className={`text-2xl font-bold -tracking-tight transition-opacity duration-300 ${
                  collapsed ? "opacity-0 w-0" : "opacity-100"
                }`}
                collapsed={collapsed}
              >
                {collapsed ? <span>A</span> : <span>AMS</span>}
              </SidebarGroupLabel>
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-white transition-colors ml-auto"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? (
                  <ChevronRight
                    className="text-white hover:text-black"
                    size={20}
                  />
                ) : (
                  <ChevronLeft
                    className="text-white hover:text-black"
                    size={20}
                  />
                )}
              </button>
            </div>

            <SidebarGroup>
              <SidebarGroupContent className="pt-8 px-2">
                <SidebarMenu>
                  {items.map((item: any) => (
                    <SidebarMenuItem key={item.title}>
                      <Link
                        to={item.url}
                        className={`flex items-center ${
                          collapsed ? "" : "gap-3"
                        } w-full`}
                        title={collapsed ? item.title : ""}
                      >
                        <SidebarMenuButton
                          className={`w-full py-3 px-4 rounded-md flex items-center ${
                            collapsed ? "justify-center" : "gap-3"
                          }`}
                          collapsed={collapsed}
                          isActive={isActiveRoute(item.url)}
                        >
                          <item.icon className="flex-shrink-0" size={24} />
                          {!collapsed && (
                            <span className="text-base font-medium whitespace-nowrap">
                              {item.title}
                            </span>
                          )}
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </SidebarContent>
      </Sidebar>
    </div>
  );
};

export default AppSidebar;
