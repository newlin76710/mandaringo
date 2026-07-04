"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, KeyRound } from "lucide-react";
import { updateTeacherAccessCode } from "@/app/actions/settings";
import { FormField } from "@/components/lms/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormValues = { code: string; confirmCode: string };

export function TeacherAccessCodeForm({ isSet }: { isSet: boolean }) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const result = await updateTeacherAccessCode(values);
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("老師註冊密碼已更新");
    reset();
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-600">
        <KeyRound className="h-4 w-4" />
        目前狀態：{isSet ? <span className="font-semibold text-emerald-600">已設定</span> : <span className="font-semibold text-red-500">尚未設定（老師將無法完成註冊）</span>}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
        <FormField label="新的老師註冊密碼" required error={errors.code?.message}>
          <Input type="text" placeholder="至少 6 個字元" {...register("code", { required: "必填", minLength: { value: 6, message: "密碼至少 6 個字元" } })} />
        </FormField>
        <FormField label="確認密碼" required error={errors.confirmCode?.message}>
          <Input type="text" {...register("confirmCode", { required: "必填" })} />
        </FormField>
        <Button type="submit" disabled={submitting} className="sm:col-span-2 w-fit">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSet ? "更新密碼" : "設定密碼"}
        </Button>
      </form>
      <p className="mt-3 text-xs text-slate-400">
        這組密碼會提供給想加入的老師，在註冊或完成帳號設定時輸入，用來確認身份。密碼以雜湊方式儲存，這裡看不到目前設定的內容。
      </p>
    </div>
  );
}
