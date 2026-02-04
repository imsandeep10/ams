import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import BackButton from "@/components/BackButton";
import { type PaymentFormData, paymentSchema } from "@/schema/paymentSchema";
import { useGetStudentById } from "@/lib/api/useStudents";
import { usePatchPayment } from "@/lib/api/usePayment";
import { StudentPaymentForm } from "./studentPayment.Form";
import {
  BookStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/shared/interface/studentResponse";

export const StudentPaymentContainer = () => {
  const { id } = useParams();

  const { data: studentData } = useGetStudentById(id!);
  const { mutate: patchPayment, isPending: isUpdating } = usePatchPayment();

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      amount: "0",
      paymentMethod: PaymentMethod.includes(
        studentData?.payment?.paymentMethod! as any,
      )
        ? (studentData?.payment?.paymentMethod! as "CASH" | "ONLINE")
        : undefined,
      paymentStatus: PaymentStatus.includes(
        studentData?.payment?.paymentStatus! as any,
      )
        ? (studentData?.payment?.paymentStatus! as
            | "FULL_PAID"
            | "PARTIAL_PAID"
            | "NOT_PAID")
        : undefined,
      book: BookStatus.includes(studentData?.payment?.bookStatus! as any)
        ? (studentData?.payment?.bookStatus! as
            | "NO_BOOK_TAKEN"
            | "TWO_BOOKS_TAKEN"
            | "ALL_BOOKS_TAKEN")
        : undefined,
      language: "IELTS",
      remarks: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (!studentData) return;

    const payment = studentData.payment;

    reset({
      fullName: studentData.user?.fullName ?? "",
      phoneNumber: studentData.user?.phoneNumber ?? "",
      amount: payment?.paymentAmount?.toString() ?? "0",
      paymentMethod: payment?.paymentMethod ?? "CASH",
      paymentStatus: payment?.paymentStatus ?? "NOT_PAID",
      book: payment?.bookStatus ?? "NO_BOOK_TAKEN",
      language: studentData.language ?? "IELTS",
      remarks: payment?.remarks ?? "",
    });
  }, [studentData, reset]);

  const handleSubmit = (data: PaymentFormData) => {
    if (!studentData?.id) return;

    patchPayment({
      studentId: studentData.id,
      paymentStatus: data.paymentStatus ?? "NOT_PAID",
      remarks: data.remarks,
      paymentMethod: data.paymentMethod!,
      paymentAmount: parseFloat(data.amount),
      bookStatus: data.book ?? "NO_BOOK_TAKEN",
    });
  };

  return (
    <div>
      <BackButton />
      <StudentPaymentForm
        form={form}
        onSubmit={handleSubmit}
        isUpdating={isUpdating}
        title="Payment Information"
      />
    </div>
  );
};

export default StudentPaymentContainer;
