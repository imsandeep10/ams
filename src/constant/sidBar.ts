import type { SidBartypes } from "../types/sidebarTypes";
import {
  BookOpen,
  FileText,
  LayoutDashboard,
  NotebookText,
  Radius,
  SquarePlus,
  TreeDeciduous,
  UserStar,
} from "lucide-react";
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
    title: "Admins",
    url: "/admins",
    icon: UserStar,
  },
];
