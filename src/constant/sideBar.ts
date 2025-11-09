import type { SidBartypes } from "@/types/sidebarTypes";
import {
  BookOpen,
  FileText,
  Key,
  LayoutDashboard,
  NotebookText,
  Radius,
  SquarePlus,
  TreeDeciduous,
  UserStar,
  Users,
} from "lucide-react";

// Base sidebar items for superAdmin
export const sideBar: SidBartypes[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "IELTS",
    url: "/ielts",
    icon: NotebookText,
  },
  {
    title: "PTE",
    url: "/pte",
    icon: BookOpen,
  },
  {
    title: "Duolingo",
    url: "/duolingo",
    icon: TreeDeciduous,
  },
  {
    title: "SAT",
    url: "/sat",
    icon: Radius,
  },
  {
    title: "Report",
    url: "/report",
    icon: FileText,
  },
  {
    title: "Create-Admin",
    url: "/create-admin",
    icon: SquarePlus,
  },
  {
    title: "Change Admin Password",
    url: "/password-admin",
    icon: Key,
  },
  {
    title: "Admins",
    url: "/admins",
    icon: UserStar,
  },
];

// Role-based sidebars
export const roleSidebars: Record<string, SidBartypes[]> = {
  superAdmin: sideBar,
  pteAdmin: [
    { title: "Dashboard", url: "/pte/dashboard", icon: LayoutDashboard },
    { title: "Students", url: "/pte/students", icon: Users },
    { title: "Report", url: "/pte/report", icon: FileText },
  ],
  ieltsAdmin: [
    { title: "Dashboard", url: "/ielts/dashboard", icon: LayoutDashboard },
    { title: "Students", url: "/ielts/students", icon: Users },
    { title: "Report", url: "/ielts/report", icon: FileText },
  ],
  duolingoAdmin: [
    { title: "Dashboard", url: "/duolingo/dashboard", icon: LayoutDashboard },
    { title: "Students", url: "/duolingo/students", icon: Users },
    { title: "Report", url: "/duolingo/report", icon: FileText },
  ],
  satAdmin: [
    { title: "Dashboard", url: "/sat/dashboard", icon: LayoutDashboard },
    { title: "Students", url: "/sat/students", icon: Users },
    { title: "Report", url: "/sat/report", icon: FileText },
  ],
};