// import { create } from "zustand";
// import api from "../axiosInstance";
// import { jwtDecode } from "jwt-decode";

// interface User {
//   id: string;
//   fullName: string;
//   email: string;
//   role: string;
//   profileImageUrl: string | null;
//   profileImageId: string | null;
// }

// interface AuthState {
//   accessToken: string | null;
//   refreshToken: string | null;
//   user: User | null;
//   role: string | null;
//   setTokens: (accessToken: string, refreshToken?: string) => void;
//   logout: () => void;
//   checkAuth: () => Promise<boolean>;
//   login: (
//     email: string,
//     password: string
//   ) => Promise<{ success: boolean; error?: string }>;
//   getRole: () => string | null;
//   getRedirectPath: () => string;
// }

// export const useAuthStore = create<AuthState>((set, get) => ({
//   accessToken: localStorage.getItem("accessToken"),
//   refreshToken: localStorage.getItem("refreshToken"),
//   user: JSON.parse(localStorage.getItem("user") || "null"),
//   role: localStorage.getItem("role"),

//   setTokens: (accessToken, refreshToken) => {
//     localStorage.setItem("accessToken", accessToken);
//     if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

//     try {
//       const decoded: any = jwtDecode(accessToken);
//       const userRole = decoded?.role || decoded?.roles || null;

//       localStorage.setItem("role", userRole);
//       set({ accessToken, refreshToken, role: userRole });
//     } catch (e) {
//       set({ accessToken, refreshToken, role: null });
//     }
//   },

//   logout: () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("user");
//     localStorage.removeItem("role");
//     set({ accessToken: null, refreshToken: null, user: null, role: null });
//   },

//   checkAuth: async () => {
//     const token = get().accessToken || localStorage.getItem("accessToken");
//     if (!token) return false;

//     try {
//       const decoded: any = jwtDecode(token);
//       const role = decoded?.role || decoded?.roles || null;

//       // Check if we have user data in localStorage
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         set({ role, user: JSON.parse(storedUser) });
//       } else {
//         set({ role });
//       }

//       localStorage.setItem("role", role);
//       return true;
//     } catch (e) {
//       get().logout();
//       return false;
//     }
//   },

//   login: async (email, password) => {
//     try {
//       const response = await api.post("/api/login/signin", { email, password });
//       const { accessToken, refreshToken, user } = response.data;

//       // Save tokens
//       get().setTokens(accessToken, refreshToken);

//       // Save user object from API response
//       localStorage.setItem("user", JSON.stringify(user));
//       set({ user });

//       return { success: true };
//     } catch (err: any) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data?.error ||
//         "Login failed. Please try again.";

//       return { success: false, error: errorMessage };
//     }
//   },

//   getRole: () => {
//     return get().role;
//   },

//   getRedirectPath: () => {
//     const role = get().role;
//     switch (role) {
//       case "superAdmin":
//         return "/dashboard";
//       case "pteAdmin":
//         return "/pte/dashboard";
//       case "ieltsAdmin":
//         return "/ielts/dashboard";
//       case "duolingoAdmin":
//         return "/duolingo/dashboard";
//       case "satAdmin":
//         return "/sat/dashboard";
//       default:
//         return "/dashboard";
//     }
//   },
// }));

// export const getAuthStore = () => useAuthStore.getState();
