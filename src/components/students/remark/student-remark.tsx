import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetStudentById } from "@/lib/api/useStudents";
import { remarksSchema, type RemarksFormData } from "@/schema/remarks.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

const StudentRemark: React.FC = React.memo(() => {
  const { id } = useParams<{ id: string }>();
  const { data: studentData, isPending: isLoading } = useGetStudentById(id!);

  const form = useForm<RemarksFormData>({
    resolver: zodResolver(remarksSchema),
    defaultValues: {
      studentId: studentData?.id || "",
      subject: "",
      priorityStatus: "low",
      remark: "",
    },
  });

  const onSubmit = (data: RemarksFormData) => {
    console.log(data);
  };

  useEffect(() => {
    form.reset({
      studentId: studentData?.id || "",
      subject: "",
      priorityStatus: "low",
      remark: "",
    });
  }, [studentData, form]);

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <BackButton />
        <Card className="mt-4">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 w-full items-start gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-4 md:space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-32 md:h-40 w-full" />
                </div>
                <Skeleton className="h-11 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 ">
      {/* back button */}
      <BackButton />

      {/* remark card */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Student Remark</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 md:space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 w-full items-start gap-4">
                <div className="space-y-2">
                  <Label>Student Name</Label>
                  <Input value={studentData?.user.fullName} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input value={studentData?.user.phoneNumber} disabled />
                </div>
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor="subject">
                        Subject <span className="text-red-500">*</span>
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          id="subject"
                          placeholder="Enter subject"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priorityStatus"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor="priorityStatus">
                        Priority Status <span className="text-red-500">*</span>
                      </Label>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select priority status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4 md:space-y-6">
                <FormField
                  control={form.control}
                  name="remark"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor="remark">
                        Remark <span className="text-red-500">*</span>
                      </Label>
                      <FormControl>
                        <Textarea
                          {...field}
                          id="remark"
                          placeholder="Enter remark"
                          rows={5}
                          className="resize-none min-h-32 md:min-h-40"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-auto py-3">
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
});

export default StudentRemark;
