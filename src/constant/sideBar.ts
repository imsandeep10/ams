import type { SidBartypes } from "@/shared/types/sidebarTypes";
import {
  BadgeDollarSign,
  BookCheck,
  BookOpen,
  FileText,
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
    title: "Students",
    url: "/students",
    icon: Users,
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
    title: "Add Admin",
    url: "/create-admin",
    icon: SquarePlus,
  },

  {
    title: "Admins",
    url: "/admins",
    icon: UserStar,
  },
  {
    title: "Mock Table",
    url: "/mock-data-table",
    icon: BookCheck,
  },
];

// Role-based sidebars
export const roleSidebars: Record<string, SidBartypes[]> = {
  superAdmin: [
    ...sideBar,
    {
      title: "Payment",
      url: "/payment",
      icon: BadgeDollarSign,
    },
    {
      title: "Book Table",
      url: "/book-data-table",
      icon: BookOpen,
    },
  ],
  pteAdmin: [
    { title: "Dashboard", url: "/pte/dashboard", icon: LayoutDashboard },
    { title: "Students", url: "/pte/students", icon: Users },
    { title: "Report", url: "/pte/report", icon: FileText },
  ],
  ieltsAdmin: [
    { title: "Dashboard", url: "/ielts/dashboard", icon: LayoutDashboard },
    { title: "Students", url: "/ielts/students", icon: Users },
    { title: "Report", url: "/ielts/report", icon: FileText },
    { title: "Mock", url: "/ielts/mock-data-table", icon: BookCheck },
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
  accountant: [
    { title: "Dashboard", url: "/accountant/dashboard", icon: LayoutDashboard },
    { title: "Students", url: "/accountant/students", icon: Users },
    { title: "IELTS", url: "/ielts/students", icon: Users },
    { title: "PTE", url: "/pte/students", icon: Users },
    { title: "Duolingo", url: "/duolingo/students", icon: Users },
    { title: "SAT", url: "/sat/students", icon: Users },
    {
      title: "Payment",
      url: "/payment",
      icon: BadgeDollarSign,
    },
    {
      title: "Book Table",
      url: "/book-data-table",
      icon: BookOpen,
    },
  ],
};
