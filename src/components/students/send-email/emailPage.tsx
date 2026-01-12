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
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";
import { useStudentSearch } from "@/lib/api/useStudents";
import { useCurrentUser } from "@/lib/api/useUser";
import { emailSchema, type EmailFormData } from "@/schema/emailSchema";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useGetStudentsByLanguage } from "@/lib/api/useStudents";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const EmailPage: React.FC = React.memo(() => {
  // const { data: studentData, isPending } = useGetStudentsByLanguage();
  const [emailFilter, setEmailFilter] = useState<string>("");
  const { data: studentByEmail } = useStudentSearch(emailFilter);
  const { data: currentStudent } = useCurrentUser();
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      to: [],
      subject: "",
      message: "",
      from: currentStudent?.fullName || "",
    },
  });

  setEmailFilter("");

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
              onSubmit={form.handleSubmit((data) => {
                console.log(data);
              })}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="emailId"
                      className="block mb-2 font-medium text-sm"
                    >
                      Email id:
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        onValuesChange={field.onChange}
                        values={field.value}
                      >
                        <MultiSelectTrigger className="w-full">
                          <MultiSelectValue placeholder="Select emails" />
                        </MultiSelectTrigger>
                        <MultiSelectContent
                          search={{
                            placeholder: "Search emails",
                            emptyMessage: "No emails found",
                          }}
                        >
                          <MultiSelectGroup>
                            {studentByEmail?.map((item: any) => (
                              <MultiSelectItem
                                key={item.email}
                                value={item.email}
                              >
                                {item.email}
                              </MultiSelectItem>
                            ))}
                          </MultiSelectGroup>
                        </MultiSelectContent>
                      </MultiSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="subject">Subject:</FormLabel>
                    <FormControl>
                      <Input
                        id="subject"
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
                name="message"
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
