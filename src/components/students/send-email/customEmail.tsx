import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useCustomSingleEmail } from "@/lib/api/useEmail";
import { useGetStudentById } from "@/lib/api/useStudents";
import type { CustomEmailData } from "@/shared/types/sendEmail.types";
import { SendEmailSchema } from "@/shared/types/sendEmail.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

const CustomEmailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: currentStudent, isPending: isLoading } = useGetStudentById(id!);
  const { mutate: sendCustomEmail, isPending } = useCustomSingleEmail();

  const form = useForm<CustomEmailData>({
    resolver: zodResolver(SendEmailSchema),
    defaultValues: {
      email: "",
      customSubject: "",
      body: "",
    },
    values: currentStudent
      ? {
          email: currentStudent?.user.email || "",
          customSubject: "",
          body: "",
        }
      : undefined,
  });

  const handleSubmit = (data: CustomEmailData) => {
    sendCustomEmail(data);
  };

  if (isLoading) {
    return (
      <div>
        <BackButton />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-[150px] w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <BackButton />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Write an Email</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="emailId"
                      className="block mb-2 font-medium text-sm"
                    >
                      Email id:
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="emailId"
                        placeholder="Enter email id"
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customSubject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="customSubject">Subject:</FormLabel>
                    <FormControl>
                      <Input
                        id="customSubject"
                        placeholder="Enter subject"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="message">Message:</FormLabel>
                    <FormControl>
                      <Textarea
                        id="message"
                        placeholder="Type your message here"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="px-4 py-2 w-full cursor-pointer"
                disabled={isPending}
              >
                {isPending ? "Sending..." : "Send Email"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomEmailPage;
