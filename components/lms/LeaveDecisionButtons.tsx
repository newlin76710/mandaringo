"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, Loader2 } from "lucide-react";
import { decideLeaveRequest } from "@/app/actions/leave";
import { Button } from "@/components/ui/button";

export function LeaveDecisionButtons({ leaveId }: { leaveId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function decide(decision: "APPROVED" | "REJECTED") {
    startTransition(async () => {
      const result = await decideLeaveRequest(leaveId, { decision });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(decision === "APPROVED" ? "已核准請假" : "已駁回請假");
      router.refresh();
    });
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="success" disabled={pending} onClick={() => decide("APPROVED")}>
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
        核准
      </Button>
      <Button size="sm" variant="destructive" disabled={pending} onClick={() => decide("REJECTED")}>
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
        駁回
      </Button>
    </div>
  );
}
