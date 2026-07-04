"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, GraduationCap } from "lucide-react";
import { teacherProfileSchema, type TeacherProfileInput } from "@/lib/schemas/auth";
import { applyToBecomeTeacher } from "@/app/actions/teacher-application";
import { FormField } from "@/components/lms/FormField";
import { GenderSelect } from "@/components/lms/GenderSelect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const schema = z.object({ teacherAccessCode: z.string().min(1, "請輸入老師註冊密碼") }).and(teacherProfileSchema);
type FormValues = TeacherProfileInput & { teacherAccessCode: string };

export function BecomeTeacherDialog({ defaultValues }: { defaultValues?: Partial<TeacherProfileInput> }) {
  const router = useRouter();
  const { update } = useSession();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { gender: "FEMALE", ...defaultValues } });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const { teacherAccessCode, ...profile } = values;
    const result = await applyToBecomeTeacher({ teacherAccessCode, ...profile });
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("您現在也是老師身分了！");
    setOpen(false);
    await update();
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <GraduationCap className="h-4 w-4" />
          申請成為老師
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>申請成為老師</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="中文姓氏" required error={errors.chineseLastName?.message}>
              <Input {...register("chineseLastName")} />
            </FormField>
            <FormField label="中文名字" required error={errors.chineseFirstName?.message}>
              <Input {...register("chineseFirstName")} />
            </FormField>
            <FormField label="英文姓氏" required error={errors.englishLastName?.message}>
              <Input {...register("englishLastName")} />
            </FormField>
            <FormField label="英文名字" required error={errors.englishFirstName?.message}>
              <Input {...register("englishFirstName")} />
            </FormField>
            <FormField label="性別" required error={errors.gender?.message}>
              <GenderSelect control={control} name="gender" />
            </FormField>
            <FormField label="電話" required error={errors.phone?.message}>
              <Input {...register("phone")} />
            </FormField>
            <FormField label="國籍／居住地" required error={errors.nationality?.message}>
              <Input {...register("nationality")} />
            </FormField>
            <FormField label="郵遞區號" required error={errors.postalCode?.message}>
              <Input {...register("postalCode")} />
            </FormField>
            <FormField label="老師註冊密碼" required error={errors.teacherAccessCode?.message} className="sm:col-span-2">
              <Input type="password" placeholder="請向行政人員索取" {...register("teacherAccessCode")} />
            </FormField>
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            送出申請
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
