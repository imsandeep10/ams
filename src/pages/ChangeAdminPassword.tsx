import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChangeAdminPw } from "@/lib/api/useAdmin";
import { useNavigate } from "react-router-dom";

type FormValues = {
  email: string;
  newPassword: string;
  confirmPassword: string;
};

export default function AdminPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setError,
  } = useForm<FormValues>();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const newPassword = watch("newPassword");

  const { mutateAsync: changePassword, isPending } = useChangeAdminPw();

  const onSubmit = async (data: FormValues) => {
    try {
      const passwordData = {
        email: data.email,
        newPassword: data.newPassword,
      };

      await changePassword(passwordData);

      // Reset form on success
      reset();
    } catch (error: any) {
      // Handle specific API errors
      const errorMessage = error.response?.data?.message;

      if (errorMessage?.includes("matches the old one")) {
        setError("newPassword", {
          type: "manual",
          message: "New password must be different from current password",
        });
      } else if (errorMessage?.includes("Admin not found")) {
        setError("email", {
          type: "manual",
          message: "Admin email not found",
        });
      } else {
        // Generic error
        setError("root", {
          type: "manual",
          message:
            errorMessage || "Failed to change password. Please try again.",
        });
      }
    }
  };

  const isChanging = isSubmitting || isPending;

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 hover:bg-gray-200  cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Change Admin Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email field */}
              <div>
                <Label htmlFor="email" className="mb-2">
                  Admin Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <p role="alert" className="text-sm text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* New Password field */}
              <div>
                <Label htmlFor="newPassword" className="mb-2">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password (min 8 characters)"
                    {...register("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    aria-invalid={errors.newPassword ? "true" : "false"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    className={cn(
                      "absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center rounded px-1 py-1",
                      "text-sm hover:bg-slate-100 transition-colors"
                    )}
                    aria-label={
                      showNewPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p role="alert" className="text-sm text-red-600 mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password field */}
              <div>
                <Label htmlFor="confirmPassword" className="mb-2">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === newPassword || "Passwords do not match",
                    })}
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className={cn(
                      "absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center rounded px-1 py-1",
                      "text-sm hover:bg-slate-100 transition-colors"
                    )}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p role="alert" className="text-sm text-red-600 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Root error display */}
              {errors.root && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p role="alert" className="text-sm text-red-600">
                    {errors.root.message}
                  </p>
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isChanging}
                >
                  {isChanging ? "Changing Password..." : "Change Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
