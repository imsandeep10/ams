import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RoleProtected, {
  RoleIndexRedirect,
} from "./components/common/RoleProtected";
import AuthLayout from "./components/layouts/authLayout";
import AppLayout from "./components/layouts/appLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import ProtectedRoute from "./components/common/protectedRoute";
import RoleLayout from "./components/layouts/roleLayout";
import SuccessMessage from "./components/student-register/SuccessMessage";
import RootLayout from "./components/layouts/RootLayout";
import {
  AdminPageRoute,
  AdminPasswordFormRoute,
  AdminProfileRoute,
  AllStudentPageRoute,
  AttendacneRoute,
  CreateAdminRoute,
  CreateStudentRoute,
  DashboardPageRoute,
  DuolingoPageRoute,
  EditAdminPageRoute,
  EditStudentRoute,
  ForgotPasswordRoute,
  IeltsMockTestFormRoute,
  IeltsPageRoute,
  LoginRoute,
  MockRegisterDataRoute,
  ProfileRoute,
  PtePageRoute,
  ReportRoute,
  SatPageRoute,
  StudentProfileRoute,
  StudentRegisterRoute,
  StudentTrackRoute,
} from "./lazyRoutes/route";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <LoginRoute />,
          },
          {
            path: "forgot-password",
            element: <ForgotPasswordRoute />,
          },
          {
            path: "attendence-student",
            element: <AttendacneRoute />,
          },
        ],
      },
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: <DashboardPageRoute />,
          },
          {
            path: "pte",
            element: (
              <RoleProtected allowedRoles={["pteAdmin", "superAdmin"]}>
                <RoleLayout />
              </RoleProtected>
            ),
            children: [
              {
                index: true,
                element: <RoleIndexRedirect adminRole={"pteAdmin"} />,
              },
              { path: "dashboard", element: <DashboardPageRoute /> },
              { path: "students", element: <PtePageRoute /> },
              { path: "students/create", element: <CreateStudentRoute /> },
              { path: "students/edit/:id", element: <EditStudentRoute /> },
              { path: "report", element: <ReportRoute /> },
            ],
          },
          {
            path: "ielts",
            element: (
              <RoleProtected allowedRoles={["ieltsAdmin", "superAdmin"]}>
                <RoleLayout />
              </RoleProtected>
            ),
            children: [
              {
                index: true,
                element: <RoleIndexRedirect adminRole={"ieltsAdmin"} />,
              },
              { path: "dashboard", element: <DashboardPageRoute /> },
              { path: "students", element: <IeltsPageRoute /> },
              { path: "students/create", element: <CreateStudentRoute /> },
              { path: "students/edit/:id", element: <EditStudentRoute /> },
              { path: "report", element: <ReportRoute /> },
              {
                path: "mock-data-table",
                element: <MockRegisterDataRoute />,
              },
            ],
          },
          {
            path: "duolingo",
            element: (
              <RoleProtected allowedRoles={["duolingoAdmin", "superAdmin"]}>
                <RoleLayout />
              </RoleProtected>
            ),
            children: [
              {
                index: true,
                element: <RoleIndexRedirect adminRole={"duolingoAdmin"} />,
              },
              { path: "dashboard", element: <DashboardPageRoute /> },
              { path: "students", element: <DuolingoPageRoute /> },
              { path: "students/edit/:id", element: <EditStudentRoute /> },
              { path: "report", element: <ReportRoute /> },
            ],
          },
          {
            path: "sat",
            element: (
              <RoleProtected allowedRoles={["satAdmin", "superAdmin"]}>
                <RoleLayout />
              </RoleProtected>
            ),
            children: [
              {
                index: true,
                element: <RoleIndexRedirect adminRole={"satAdmin"} />,
              },
              { path: "dashboard", element: <DashboardPageRoute /> },
              { path: "students", element: <SatPageRoute /> },
              { path: "students/create", element: <CreateStudentRoute /> },
              { path: "students/edit/:id", element: <EditStudentRoute /> },
              { path: "report", element: <ReportRoute /> },
            ],
          },
          {
            path: "students",
            element: (
              <RoleProtected allowedRoles={["superAdmin"]}>
                <AllStudentPageRoute />
              </RoleProtected>
            ),
          },
          {
            path: "report",
            element: <ReportRoute />,
          },
          {
            path: "create-student",
            element: <CreateStudentRoute />,
          },
          {
            path: "edit-student/:id",
            element: <EditStudentRoute />,
          },
          {
            path: "student-profile/:id",
            element: <StudentProfileRoute />,
          },
          {
            path: "student-track/:id",
            element: <StudentTrackRoute />,
          },
          {
            path: "create-admin",
            element: <CreateAdminRoute />,
          },
          {
            path: "Password-admin",
            element: <AdminPasswordFormRoute />,
          },
          {
            path: "edit-admin/:id",
            element: <EditAdminPageRoute />,
          },
          {
            path: "admins",
            element: <AdminPageRoute />,
          },
          {
            path: "admin-profile/:id",
            element: <AdminProfileRoute />,
          },
          {
            path: "profile",
            element: <ProfileRoute />,
          },
          {
            path: "mock-data-table",
            element: <MockRegisterDataRoute />,
          },
        ],
      },
      {
        path: "/attendance",
        element: <AttendacneRoute />,
      },
      {
        path: "register/newstudent",
        element: <StudentRegisterRoute mode="create" />,
      },
      {
        path: "mock-test/register",
        element: <IeltsMockTestFormRoute />,
      },
      {
        path: "/success-message",
        element: <SuccessMessage />,
      },
    ],
  },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position={"top-right"} richColors />
    </QueryClientProvider>
  );
};

export default App;
