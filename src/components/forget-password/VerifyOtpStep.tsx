import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { verifyOtpSchema } from "@/schema/resetPasswordSchemas";
import type { VerifyOtpForm } from "@/schema/resetPasswordSchemas";
import { useVerifyOtp } from "@/lib/api/useResetPassword";

type Props = {
  email: string;
  onVerified: () => void;
  isLoading?: boolean;
};

export default function VerifyOtpStep({ email, onVerified, isLoading }: Props) {
  const form = useForm<VerifyOtpForm>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email, otp: "" },
  });

  const verifyOtp = useVerifyOtp();

  useEffect(() => {
    form.setValue("email", email);
  }, [email, form]);

  const onSubmit = async (values: VerifyOtpForm) => {
    await verifyOtp.mutateAsync({ email: values.email, otp: values.otp });
    onVerified();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="text" placeholder="Enter 6-digit OTP" maxLength={6} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || verifyOtp.isPending}>Verify OTP</Button>
      </form>
    </Form>
  );
}
