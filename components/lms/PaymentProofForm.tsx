"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { submitPaymentProof } from "@/app/actions/enrollment";
import { FormField } from "@/components/lms/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormValues = { transferLastFive: string; transferDate: string };

export function PaymentProofForm({ enrollmentId }: { enrollmentId: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  if (done) {
    return <p className="text-sm font-semibold text-emerald-600">已送出，行政人員確認後會通知您。</p>;
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const result = await submitPaymentProof(enrollmentId, values);
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setDone(true);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="匯款帳號末 5 碼" required error={errors.transferLastFive?.message}>
          <Input maxLength={5} placeholder="12345" {...register("transferLastFive", { required: "必填" })} />
        </FormField>
        <FormField label="匯款日期" required error={errors.transferDate?.message}>
          <Input type="date" {...register("transferDate", { required: "必填" })} />
        </FormField>
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        送出付款證明
      </Button>
    </form>
  );
}
