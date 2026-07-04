"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ActiveToggleButton({
  id,
  isActive,
  action,
}: {
  id: string;
  isActive: boolean;
  action: (id: string, next: boolean) => Promise<{ success?: true; error?: string }>;
}) {
  const [pending, startTransition] = useTransition();
  const [active, setActive] = useState(isActive);

  function handleClick() {
    startTransition(async () => {
      const result = await action(id, !active);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setActive(!active);
      toast.success(!active ? "已啟用" : "已停用");
    });
  }

  return (
    <Button size="sm" variant={active ? "outline" : "success"} disabled={pending} onClick={handleClick}>
      {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {active ? "停用" : "啟用"}
    </Button>
  );
}
