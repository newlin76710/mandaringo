"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Check, X, Loader2 } from "lucide-react";
import { approvePayment, rejectPayment } from "@/app/actions/payment";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function PaymentActions({ enrollmentId }: { enrollmentId: string }) {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  function handleApprove() {
    startTransition(async () => {
      const result = await approvePayment(enrollmentId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("已核准，課程已開通");
    });
  }

  function handleReject() {
    startTransition(async () => {
      const result = await rejectPayment(enrollmentId, { reason });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("已退回此報名");
      setOpen(false);
    });
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="success" disabled={pending} onClick={handleApprove}>
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
        核准
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="destructive">
            <X className="h-3.5 w-3.5" />
            退回
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>退回付款確認</DialogTitle>
          </DialogHeader>
          <Textarea placeholder="請輸入退回原因（將寄送通知給家長／學生）" value={reason} onChange={(e) => setReason(e.target.value)} />
          <DialogFooter>
            <Button variant="destructive" disabled={pending || !reason.trim()} onClick={handleReject}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              確認退回
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
