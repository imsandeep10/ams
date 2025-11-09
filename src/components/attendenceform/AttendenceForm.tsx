import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export type PhoneFormData = {
  phone: string;
};

const PHONE_REGEX = /^[\d\s\-\+\(\)]{10,}$/;

const phoneFormSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, { message: "Phone number is required." })
    .regex(PHONE_REGEX, {
      message: "Please enter a valid phone number (at least 10 digits).",
    }),
});

export function AttendenceForm() {
  const form = useForm<PhoneFormData>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: { phone: "" },
  });

  const onSubmit = async (data: PhoneFormData) => {
    try {
      console.log(data);
      form.reset();
    } catch (error) {}
  };

  return (
    <div className="flex justify-center items-center w-full  h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+977 "
                    type="tel"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter your phone number with area code (10+ digits).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full cursor-pointer"
          >
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
