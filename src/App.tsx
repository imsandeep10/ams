import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Report } from "./pages/Report";
import IeltsPage from "./pages/ieltsPage";
import DuolingoPage from "./pages/duolingoPage";
import SatPage from "./pages/satPage";
import PtePage from "./pages/ptePage";
import RoleProtected, {
  RoleIndexRedirect,
} from "./components/common/RoleProtected";
import { CreateStudent } from "./pages/common/CreateStudent";
import AuthLayout from "./components/layouts/authLayout";
import LoginForm from "./components/auth/LoginForm";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AppLayout from "./components/layouts/appLayout";
import DashboardPage from "./pages/dashboardPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import { StudentProfile } from "./pages/StudentProfile";
import { StudentTrack } from "./pages/StudentTrack";
import ProtectedRoute from "./components/common/protectedRoute";
import { EditStudent } from "./pages/common/EditStudent";
import { CreateAdminPage } from "./pages/adminForm/CreateAdminPage";
import { AttendenceForm } from "./components/attendenceform/AttendenceForm";
import AttendancePage from "./pages/AttendancePage";
import AdminsPage from "./pages/AdminsPage";
import { EditAdminPage } from "./pages/adminForm/EditAdminPage";
import { Profile } from "./pages/Profile";
import RoleLayout from "./components/layouts/roleLayout";
import { StudentRegisterForm } from "./components/student-register/StudentResgister";
import SuccessMessage from "./components/student-register/SuccessMessage";
import AdminPasswordForm from "./pages/ChangeAdminPassword";
import { AdminProfile } from "./pages/AdminProfile";
import MockRegisterData from "./pages/MockRegisterData";
import IeltsMockTestForm from "./components/mock-test/IeltsMockTestForm";

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
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginForm />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "attendence-student",
        element: <AttendenceForm />,
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
        element: <DashboardPage />,
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
          { path: "dashboard", element: <DashboardPage /> },
          { path: "students", element: <PtePage /> },
          { path: "students/create", element: <CreateStudent /> },
          { path: "students/edit/:id", element: <EditStudent /> },
          { path: "report", element: <Report /> },
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
          { path: "dashboard", element: <DashboardPage /> },
          { path: "students", element: <IeltsPage /> },
          { path: "students/create", element: <CreateStudent /> },
          { path: "students/edit/:id", element: <EditStudent /> },
          { path: "report", element: <Report /> },
          {
            path: "mock-data-table",
            element: <MockRegisterData />,
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
          { path: "dashboard", element: <DashboardPage /> },
          { path: "students", element: <DuolingoPage /> },
          { path: "students/edit/:id", element: <EditStudent /> },
          { path: "report", element: <Report /> },
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
          { path: "dashboard", element: <DashboardPage /> },
          { path: "students", element: <SatPage /> },
          { path: "students/create", element: <CreateStudent /> },
          { path: "students/edit/:id", element: <EditStudent /> },
          { path: "report", element: <Report /> },
        ],
      },
      {
        path: "report",
        element: <Report />,
      },
      {
        path: "create-student",
        element: <CreateStudent />,
      },
      {
        path: "edit-student/:id",
        element: <EditStudent />,
      },
      {
        path: "student-profile/:id",
        element: <StudentProfile />,
      },
      {
        path: "student-track/:id",
        element: <StudentTrack />,
      },
      {
        path: "create-admin",
        element: <CreateAdminPage />,
      },
      {
        path: "Password-admin",
        element: <AdminPasswordForm />,
      },
      {
        path: "edit-admin/:id",
        element: <EditAdminPage />,
      },
      {
        path: "admins",
        element: <AdminsPage />,
      },
      {
        path: "admin-profile/:id",
        element: <AdminProfile />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "mock-data-table",
        element: <MockRegisterData />,
      },
    ],
  },
  {
    path: "/attendance",
    element: <AttendancePage />,
  },
  {
    path: "register/newstudent",
    element: <StudentRegisterForm mode="create" />,
  },
  {
    path: "mock-test/register",
    element: <IeltsMockTestForm />,
  },
  {
    path: "/success-message",
    element: <SuccessMessage />,
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
