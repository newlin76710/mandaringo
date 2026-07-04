"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteRecordButton({
  id,
  confirmMessage,
  redirectTo,
  action,
}: {
  id: string;
  confirmMessage: string;
  redirectTo: string;
  action: (id: string) => Promise<{ success?: true; error?: string }>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(confirmMessage)) return;
    startTransition(async () => {
      const result = await action(id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("已刪除");
      router.push(redirectTo);
      router.refresh();
    });
  }

  return (
    <Button variant="destructive" size="sm" disabled={pending} onClick={handleClick}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      刪除
    </Button>
  );
}
