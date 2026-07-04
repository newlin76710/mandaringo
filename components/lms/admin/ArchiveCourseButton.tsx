"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Archive, ArchiveRestore } from "lucide-react";
import { setCourseArchived } from "@/app/actions/course";
import { Button } from "@/components/ui/button";

export function ArchiveCourseButton({ courseId, archived }: { courseId: string; archived: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await setCourseArchived(courseId, !archived);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(archived ? "已恢復課程" : "已封存課程");
      router.refresh();
    });
  }

  return (
    <Button variant={archived ? "outline" : "destructive"} size="sm" disabled={pending} onClick={handleClick}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
      {archived ? "恢復課程" : "封存課程"}
    </Button>
  );
}
