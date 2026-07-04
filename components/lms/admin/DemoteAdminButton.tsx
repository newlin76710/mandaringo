"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, UserMinus } from "lucide-react";
import { demoteAdmin } from "@/app/actions/admin-management";
import { Button } from "@/components/ui/button";

export function DemoteAdminButton({ userId, name }: { userId: string; name: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`確定要移除「${name}」的管理員身分嗎？老師資料會完整保留，只是不再是管理員。`)) return;
    startTransition(async () => {
      const result = await demoteAdmin(userId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("已移除管理員身分");
      router.refresh();
    });
  }

  return (
    <Button variant="destructive" size="sm" disabled={pending} onClick={handleClick}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserMinus className="h-4 w-4" />}
      移除管理員身分
    </Button>
  );
}
