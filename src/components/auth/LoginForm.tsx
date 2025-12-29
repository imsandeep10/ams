// LoginForm.tsx - Responsive version
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Lock, UserRound, Loader2, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { loginSchema, type LoginFormData } from "@/schema/LoginSchema";
import { useAuth } from "@/provider/authProvider";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { login, logging: isLoading } = useAuth();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <h1 className="text-secondary text-2xl sm:text-3xl md:text-4xl font-semibold">
            Welcome!
          </h1>
          <p className="text-secondary text-base sm:text-lg md:text-xl font-semibold">
            Login to your account and continue
          </p>
        </div>

        {/* Form */}
        <div className="w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 sm:space-y-6 md:space-y-8"
            >
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Enter your email"
                          {...field}
                          className="py-5 sm:py-6 pl-10 sm:pl-12 pr-4 rounded-full border border-black placeholder:text-secondary text-sm sm:text-base"
                          disabled={isLoading}
                        />
                        <UserRound className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-secondary w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </FormControl>
                    <FormDescription className="sr-only">email</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter Password"
                          {...field}
                          className="py-5 sm:py-6 pl-10 sm:pl-12 pr-12 rounded-full border border-black placeholder:text-secondary text-sm sm:text-base"
                          disabled={isLoading}
                        />
                        <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-secondary w-4 h-4 sm:w-5 sm:h-5" />
                        <button
                          type="button"
                          onClick={() => togglePassword()}
                          aria-label={
                            showPassword ? "Hide password" : "show password"
                          }
                          className="absolute top-0 right-0 h-full px-3 sm:px-4"
                        >
                          {showPassword ? (
                            <Eye size={16} className="sm:w-5 sm:h-5" />
                          ) : (
                            <EyeOff size={16} className="sm:w-5 sm:h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription className="sr-only">
                      password
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="w-full flex items-center justify-center pt-2 sm:pt-0">
                <Button
                  className="py-5 sm:py-6 rounded-full px-8 sm:px-10 text-base sm:text-lg md:text-xl cursor-pointer w-full sm:w-auto"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>

              {/* Forgot Password Link */}
              <div className="w-full flex items-center justify-center pt-2 sm:pt-4">
                <Link
                  to="/forgot-password"
                  className="text-xs sm:text-sm text-blue-600 underline hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
