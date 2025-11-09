import { useCallback, useMemo, useState } from "react";
import RequestOtpStep from "@/components/forget-password/RequestOtpStep";
import VerifyOtpStep from "@/components/forget-password/VerifyOtpStep";
import ResetPasswordStep from "@/components/forget-password/ResetPasswordStep";
import { useRequestOtp, useResetPasswordMutation, useVerifyOtp } from "@/lib/api/useResetPassword";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type Step = "request" | "verify" | "reset" | "done";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [step, setStep] = useState<Step>("request");

  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();
  const resetPassword = useResetPasswordMutation();

  const stepTitle = useMemo(() => {
    switch (step) {
      case "request":
        return "Forgot Password";
      case "verify":
        return "Verify OTP";
      case "reset":
        return "Set New Password";
      default:
        return "All Set!";
    }
  }, [step]);

  const handleSendOtp = useCallback(
    async (e: string) => {
      setEmail(e);
      await requestOtp.mutateAsync({ email: e });
      setStep("verify");
    },
    [requestOtp]
  );

  const handleVerifyOtp = useCallback(
    async () => {
      // For clear separation, let VerifyOtpStep call verify
      setStep("reset");
    },
    []
  );

  const handleResetPassword = useCallback(
    async (newPassword: string) => {
      await resetPassword.mutateAsync({ email, newPassword });
      toast.success("You can now log in with your new password");
      setStep("done");
    },
    [email, resetPassword]
  );

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{stepTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          {step === "request" && (
            <RequestOtpStep
              initialEmail={localStorage.getItem("loginEmail") || ""}
              onNext={async (e) => {
                await handleSendOtp(e);
              }}
              isLoading={requestOtp.isPending}
            />
          )}

          {step === "verify" && (
            <VerifyOtpStep
              email={email}
              onVerified={async () => {
                await verifyOtp.mutateAsync({ email, otp: (document.querySelector('input[name="otp"]') as HTMLInputElement)?.value || "" });
                handleVerifyOtp();
              }}
              isLoading={verifyOtp.isPending}
            />
          )}

          {step === "reset" && (
            <ResetPasswordStep
              email={email}
              onSubmitNewPassword={handleResetPassword}
              isLoading={resetPassword.isPending}
            />
          )}

          {step === "done" && (
            <div className="space-y-4 text-center">
              <p>Password reset successful.</p>
              <a href="/" className="text-blue-600 underline">Return to Login</a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
