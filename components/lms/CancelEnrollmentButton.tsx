"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { cancelEnrollment } from "@/app/actions/enrollment";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

export function CancelEnrollmentButton({ enrollmentId, className }: { enrollmentId: string; className?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelEnrollment(enrollmentId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("已取消此報名");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className={cn("w-full text-red-600 hover:text-red-700", className)}>
          <X className="h-4 w-4" />
          取消此報名
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>確定要取消這筆報名嗎？</DialogTitle>
          <DialogDescription>取消後將無法復原，若要重新報名須重新繳費。</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              再想想
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" disabled={pending} onClick={handleCancel}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            確認取消
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
