"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteMemberAdmin } from "@/app/actions/admin-members";

export function DeleteMemberButton({ userId, name }: { userId: string; name: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`確定要刪除會員「${name}」嗎？登入帳號將被移除，此操作無法復原。`)) return;
    startTransition(async () => {
      const result = await deleteMemberAdmin(userId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("已刪除，該會員可重新註冊");
      router.refresh();
    });
  }

  return (
    <Button variant="destructive" size="sm" disabled={pending} onClick={handleClick}>
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      刪除
    </Button>
  );
}
