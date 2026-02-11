import { type UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

import { type PaymentFormData } from "@/schema/paymentSchema";

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "ONLINE", label: "Online" },
] as const;

const PAYMENT_STATUSES = [
  { value: "FULL_PAID", label: "Paid" },
  { value: "PARTIAL_PAID", label: "Partial" },
  { value: "NOT_PAID", label: "Unpaid" },
] as const;

const BOOK_STATUSES = [
  { value: "NO_BOOK_TAKEN", label: "No Book Taken" },
  { value: "TWO_BOOKS_TAKEN", label: "Two Books Taken" },
  { value: "ALL_BOOKS_TAKEN", label: "All Books Taken" },
] as const;

interface StudentPaymentFormProps {
  form: UseFormReturn<PaymentFormData>;
  onSubmit: (data: PaymentFormData) => void;
  isLoading?: boolean;
  isUpdating?: boolean;
  title?: string;
}

export const StudentPaymentForm: React.FC<StudentPaymentFormProps> = ({
  form,
  onSubmit,
  isUpdating = false,
  title = "Payment Information",
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 sm:space-y-6 md:space-y-8"
          >
            {/* Student Information Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <Label>Full Name</Label>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        className="cursor-not-allowed"
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
                    <Label>Phone Number</Label>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        className="cursor-not-allowed"
                      />
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
                    <Label>Language</Label>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        className="cursor-not-allowed"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Information Section */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <Label>Amount</Label>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter amount"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <Label>Payment Method</Label>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_METHODS.map((method) => (
                            <SelectItem key={method.value} value={method.value}>
                              {method.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* <Input
                        {...field}
                        readOnly
                        className="cursor-not-allowed"
                      /> */}
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
                    <Label>Payment Status</Label>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_STATUSES.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
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
                    <Label>Book Status</Label>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? "NO_BOOK_TAKEN"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select book status" />
                        </SelectTrigger>
                        <SelectContent>
                          {BOOK_STATUSES.map((book) => (
                            <SelectItem key={book.value} value={book.value}>
                              {book.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Remarks Section */}
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <Label>Remarks</Label>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter any remarks"
                      rows={8}
                      className="min-h-40"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Payment Information"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default StudentPaymentForm;
