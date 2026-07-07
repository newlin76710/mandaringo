"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Users } from "lucide-react";
import { parentProfileSchema, type ParentProfileInput } from "@/lib/schemas/auth";
import { applyToBecomeParent } from "@/app/actions/parent-application";
import { FormField } from "@/components/lms/FormField";
import { GenderSelect } from "@/components/lms/GenderSelect";
import { PhoneInput } from "@/components/lms/PhoneInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function BecomeParentDialog({ defaultValues }: { defaultValues?: Partial<ParentProfileInput> }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentProfileInput>({
    resolver: zodResolver(parentProfileSchema),
    defaultValues: { gender: "FEMALE", ...defaultValues },
  });

  async function onSubmit(profile: ParentProfileInput) {
    setSubmitting(true);
    const result = await applyToBecomeParent(profile);
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("您現在也是家長身分了！");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4" />
          申請成為家長
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>申請成為家長</DialogTitle>
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
              <PhoneInput control={control} name="phone" />
            </FormField>
            <FormField label="國籍／居住地" required error={errors.nationality?.message}>
              <Input {...register("nationality")} />
            </FormField>
            <FormField label="郵遞區號" required error={errors.postalCode?.message}>
              <Input {...register("postalCode")} />
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
