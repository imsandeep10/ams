import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { type PaymentFormData, paymentSchema } from "@/schema/paymentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Calendar1 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetStudentById } from "@/lib/api/useStudents";
import { useEffect } from "react";
import { usePatchPayment } from "@/lib/api/usePayment";

const StudentPayment = () => {
  const { id } = useParams<{ id: string }>();

  const { data: studentData, isPending: isLoading } = useGetStudentById(id!);
  const { mutate: patchPayment, isPending: isUpdating } = usePatchPayment();
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      fullName: studentData?.user.fullName || "",
      phoneNumber: studentData?.user.phoneNumber || "",
      amount: 0,
      paymentMethod: null,
      paymentStatus: "NOT_PAID",
      book: null,
      language: studentData?.language,
      remarks: "",
    },
  });

  const onSubmit = (data: PaymentFormData) => {
    if (!data) {
      console.error("Form data is null");
      return;
    }
    patchPayment({
      studentId: studentData!.id,
      paymentStatus: data.paymentStatus ?? "NOT_PAID",
      remarks: data.remarks,
      paymentMethod: data.paymentMethod!,
      paymentAmount: data.amount,
      bookStatus: data.book ?? "NO_BOOK_TAKEN",
    });
  };

  useEffect(() => {
    form.reset({
      fullName: studentData?.user.fullName || "",
      phoneNumber: studentData?.user.phoneNumber || "",
      amount: 0,
      paymentMethod: null,
      paymentStatus: "NOT_PAID",
      book: null,
      language: studentData?.language,
      remarks: "",
    });
  }, [studentData, form]);

  if (isLoading) {
    return (
      <div>
        <BackButton />
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-5 sm:space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-40 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
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
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 sm:space-y-6 md:space-y-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="fullName">Full Name</Label>
                      <FormControl>
                        <Input
                          placeholder="Enter full name"
                          {...field}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <FormControl>
                        <Input
                          placeholder="Enter phone number"
                          {...field}
                          type="number"
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="amount">Amount</Label>
                      <FormControl>
                        <Input
                          placeholder="Enter amount"
                          {...field}
                          type="number"
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="paymentDate">Payment Date</Label>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date"
                              className="w-full justify-start font-normal bg-white"
                            >
                              {field.value
                                ? new Date(field.value).toLocaleDateString(
                                    "eng",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "2-digit",
                                    }
                                  )
                                : "Select date"}
                              <Calendar1 className="ml-auto" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              captionLayout="dropdown"
                              onSelect={(date) => {
                                field.onChange(date ? date.toISOString() : "");
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            <SelectItem value="CASH">Cash</SelectItem>
                            <SelectItem value="ONLINE">Online</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="language">Language</Label>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="paymentStatus">Payment Status</Label>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || "NOT_PAID"}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select payment status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FULL_PAID">Paid</SelectItem>
                            <SelectItem value="PARTIAL_PAID">
                              Partial
                            </SelectItem>
                            <SelectItem value="NOT_PAID">Unpaid</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="book"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="book">Book</Label>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select book status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NO_BOOK_TAKEN">
                              No Book Taken
                            </SelectItem>
                            <SelectItem value="TWO_BOOKS_TAKEN">
                              Two Books Taken
                            </SelectItem>
                            <SelectItem value="ALL_BOOKS_TAKEN">
                              All Books Taken
                            </SelectItem>
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
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="remarks">Remarks</Label>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any remarks"
                        {...field}
                        rows={8}
                        className="max-h-min min-h-40"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-auto"
                disabled={isUpdating}
              >
                Save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPayment;
