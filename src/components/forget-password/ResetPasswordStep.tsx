import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { resetPasswordSchema } from "@/schema/resetPasswordSchemas";
import type { ResetPasswordForm } from "@/schema/resetPasswordSchemas";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  email: string;
  onSubmitNewPassword: (newPassword: string) => void;
  isLoading?: boolean;
};

export default function ResetPasswordStep({ email, onSubmitNewPassword, isLoading }: Props) {
  const [show, setShow] = useState(false);
  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email, newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    form.setValue("email", email);
  }, [email, form]);

  const onSubmit = (values: ResetPasswordForm) => {
    onSubmitNewPassword(values.newPassword);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input type={show ? "text" : "password"} placeholder="Enter new password" {...field} />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShow((s) => !s)}
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type={show ? "text" : "password"} placeholder="Confirm new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>Reset Password</Button>
      </form>
    </Form>
  );
}
