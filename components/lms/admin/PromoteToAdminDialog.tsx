"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { promoteTeacherToAdmin } from "@/app/actions/admin-management";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type TeacherOption = { id: string; label: string };

export function PromoteToAdminDialog({ teachers }: { teachers: TeacherOption[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [teacherId, setTeacherId] = useState(teachers[0]?.id ?? "");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!teacherId) return;
    setSubmitting(true);
    const result = await promoteTeacherToAdmin(teacherId);
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("已將此老師設為管理員");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          新增管理員
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增管理員</DialogTitle>
        </DialogHeader>
        {teachers.length === 0 ? (
          <p className="text-sm text-slate-400">目前沒有可以升級的老師帳號（必須是已經有登入帳號的在職老師）。</p>
        ) : (
          <div className="space-y-4">
            <Select value={teacherId} onValueChange={setTeacherId}>
              <SelectTrigger>
                <SelectValue placeholder="請選擇老師" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-400">管理員只能從已有登入帳號的老師中挑選升級，升級後保留原本的老師資料與課程。</p>
            <Button className="w-full" disabled={submitting} onClick={handleSubmit}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              確認設為管理員
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
