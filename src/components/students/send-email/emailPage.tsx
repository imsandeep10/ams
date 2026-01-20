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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSendEmailToAll } from "@/lib/api/useEmail";
import { useCurrentUser } from "@/lib/api/useUser";
import { emailSchema, type EmailFormData } from "@/schema/emailSchema";
import { Role } from "@/shared/interface/studentResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

const EmailPage: React.FC = React.memo(() => {
  const { mutateAsync: sendEmailToAll } = useSendEmailToAll();
  const { data: currentUser } = useCurrentUser();

  const studentFilter = (role: string) => {
    switch (role) {
      case Role.SUPER_ADMIN:
        return "all";
      case Role.DUOLINGO_ADMIN:
        return "Duolingo";
      case Role.IELTS_ADMIN:
        return "IELTS";
      case Role.PTE_ADMIN:
        return "PTE";
      case Role.SAT_ADMIN:
        return "SAT";
      default:
        return "all";
    }
  };

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      languageFilter:
        studentFilter(currentUser?.data?.role ?? Role.ADMIN) ?? "all",
      customSubject: "",
      body: "",
    },
  });

  const handleSubmit = (data: EmailFormData) => {
    sendEmailToAll(data).finally(() => {
      form.reset();
    });
  };
  return (
    <div>
      <BackButton />

      <Card>
        <CardHeader>
          <CardTitle>Write an Email</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          className="h-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="languageFilter"
                  render={({ field }) => (
                    <FormItem className="h-full">
                      <FormLabel
                        htmlFor="emailId"
                        className="blockfont-medium text-sm"
                      >
                        Email id:
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          {...field}
                          disabled={
                            currentUser?.data?.role !== Role.SUPER_ADMIN
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a student" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Students</SelectItem>
                            <SelectItem value="PTE">PTE</SelectItem>
                            <SelectItem value="IELTS">IELTS</SelectItem>
                            <SelectItem value="SAT">SAT</SelectItem>
                            <SelectItem value="Duolingo">Duolingo</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
              <Button type="submit" className="px-4 py-2 w-full cursor-pointer">
                Send Email
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
});

export default EmailPage;
