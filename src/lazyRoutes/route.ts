import { lazy } from "react";

// auth pages
export const LoginRoute = lazy(() => import("../components/auth/LoginForm"));
export const ForgotPasswordRoute = lazy(
  () => import("../pages/ForgotPasswordPage")
);
export const AttendacneRoute = lazy(() => import("../pages/AttendancePage"));

// report page
export const ReportRoute = lazy(() =>
  import("../pages/Report").then((module) => ({ default: module.Report }))
);

// langugae pages
export const IeltsPageRoute = lazy(() => import("../pages/ieltsPage"));
export const DuolingoPageRoute = lazy(() => import("../pages/duolingoPage"));
export const SatPageRoute = lazy(() => import("../pages/satPage"));
export const PtePageRoute = lazy(() => import("../pages/ptePage"));
export const MockPage = lazy(() => import("../pages/mockPage"));
export const IeltsMockTestFormRoute = lazy(
  () => import("../components/mock-test/IeltsMockTestForm")
);

// student pages
export const StudentProfileRoute = lazy(() =>
  import("../pages/StudentProfile").then((module) => ({
    default: module.StudentProfile,
  }))
);
export const StudentTrackRoute = lazy(() => import("../pages/StudentTrack"));
export const EditStudentRoute = lazy(() =>
  import("../pages/common/EditStudent").then((module) => ({
    default: module.EditStudent,
  }))
);
export const StudentRegisterRoute = lazy(() =>
  import("../components/student-register/StudentResgister").then((module) => ({
    default: module.StudentRegisterForm,
  }))
);
export const AllStudentPageRoute = lazy(
  () => import("../pages/AllStudentsPage")
);
export const CreateStudentRoute = lazy(() =>
  import("../pages/common/CreateStudent").then((module) => ({
    default: module.CreateStudent,
  }))
);
export const StudentPaymentRoute = lazy(
  () => import("../components/students/studentPayment/studentPayment")
);
export const StudentRemarkRoute = lazy(
  () => import("../components/students/remark/student-remark")
);
export const StudentFollowUpRoute = lazy(
  () => import("../components/students/send-email/emailPage")
);

// admin pages
export const DashboardPageRoute = lazy(() => import("../pages/dashboardPage"));
export const CreateAdminRoute = lazy(() =>
  import("../pages/adminForm/CreateAdminPage").then((module) => ({
    default: module.CreateAdminPage,
  }))
);
export const AdminPageRoute = lazy(() => import("../pages/AdminsPage"));
export const EditAdminPageRoute = lazy(() =>
  import("../pages/adminForm/EditAdminPage").then((module) => ({
    default: module.EditAdminPage,
  }))
);
export const ProfileRoute = lazy(() =>
  import("../pages/Profile").then((module) => ({ default: module.Profile }))
);
export const AdminPasswordFormRoute = lazy(
  () => import("../pages/ChangeAdminPassword")
);
export const AdminProfileRoute = lazy(() =>
  import("../pages/AdminProfile").then((module) => ({
    default: module.AdminProfile,
  }))
);

// payment page
export const PaymentPageRoute = lazy(
  () => import("../pages/payment/paymentPage")
);

// email page
export const CustomEmailPageRoute = lazy(
  () => import("../components/students/send-email/customEmail")
);
