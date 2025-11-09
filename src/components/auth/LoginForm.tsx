// LoginForm.tsx - Improved version
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
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
import type z from "zod";
import { Lock, UserRound, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/lib/stores/AuthStore";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginSchema } from "@/schema/LoginSchema";

const LoginForm = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof loginSchema>) => {
      setIsLoading(true);
      try {
        // store email for forgot-password autofill
        localStorage.setItem("loginEmail", values.email);
        const result = await login(values.email, values.password);
        if (result.success) {
          toast.success("Logged in successfully!");
          navigate("/dashboard");
        } else {
          toast.error(result.error || "Invalid credentials");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [login, navigate]
  );

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <div className="flex flex-col items-center pt-30">
        <h1 className="text-secondary text-4xl font-semibold">Welcome!</h1>
        <p className="text-secondary text-xl font-semibold">
          Login to your account and continue
        </p>
      </div>

      <div className="flex items-center w-md px-5 mx-auto pt-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 min-w-full"
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
                        placeholder="Email / Phone number"
                        {...field}
                        className="py-6 pl-12 rounded-full border border-black placeholder:text-secondary"
                        disabled={isLoading}
                      />
                      <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
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
                        className="py-6 pl-12 rounded-full border border-black placeholder:text-secondary"
                        disabled={isLoading}
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
                      <button
                        type="button"
                        onClick={() => togglePassword()}
                        aria-label={
                          showPassword ? "Hide password" : "show password"
                        }
                        className="absolute top-0 right-0 h-full px-3"
                      >
                        {showPassword ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
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

            <div className="w-full flex items-center justify-center">
              <Button
                className="py-6 rounded-full px-10 text-xl cursor-pointer"
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
            <div className="w-full flex items-center justify-center pt-4">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 underline"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
