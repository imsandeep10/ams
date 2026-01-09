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
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type PaymentFormData, paymentSchema } from "@/schema/paymentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const StudentPayment = () => {
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      amount: 0,
      paymentDate: "",
      paymentMethod: "cash",
      remarks: "",
    },
  });

  const onSubmit = (data: PaymentFormData) => {
    console.log(data);
  };
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
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
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
                        />
                      </FormControl>
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
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="paymentDate">Payment Date</Label>
                      <FormControl>
                        <Input placeholder="DD-MM-YY" {...field} type="date" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PTE">PTE</SelectItem>
                            <SelectItem value="SAT">SAT</SelectItem>
                            <SelectItem value="IELTS">IELTS</SelectItem>
                            <SelectItem value="DUOLINGO">Duolingo</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
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
              <Button type="submit" className="w-full">
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
