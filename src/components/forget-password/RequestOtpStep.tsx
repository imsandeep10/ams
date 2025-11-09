import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { requestOtpSchema } from "@/schema/resetPasswordSchemas";
import type { RequestOtpForm } from "@/schema/resetPasswordSchemas";

type Props = {
  initialEmail?: string;
  onNext: (email: string) => void;
  isLoading?: boolean;
};

export default function RequestOtpStep({ initialEmail, onNext, isLoading }: Props) {
  const form = useForm<RequestOtpForm>({
    resolver: zodResolver(requestOtpSchema),
    defaultValues: { email: initialEmail || "" },
  });

  useEffect(() => {
    if (initialEmail) form.setValue("email", initialEmail);
  }, [initialEmail, form]);

  const onSubmit = (values: RequestOtpForm) => {
    onNext(values.email);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          Send OTP
        </Button>
      </form>
    </Form>
  );
}
