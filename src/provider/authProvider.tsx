import { useLogin, useLogout } from "@/lib/api/useAuth";
import type { LoginFormData } from "@/schema/LoginSchema";
import { createContext, useContext } from "react";

interface AuthContextType {
  login: (data: LoginFormData) => void;
  logout: () => void;
  logging: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { mutate: loginForm, isPending: logging } = useLogin();
  const { mutate: logoutForm } = useLogout();

  const login = (data: LoginFormData) => {
    loginForm(data);
  };

  const logout = () => {
    logoutForm();
  };
  return (
    <AuthContext.Provider value={{ login, logging, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
