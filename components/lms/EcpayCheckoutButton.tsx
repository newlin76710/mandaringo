"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, CreditCard } from "lucide-react";
import { createEcpayCheckout } from "@/app/actions/ecpay";
import { Button } from "@/components/ui/button";

export function EcpayCheckoutButton({ enrollmentId }: { enrollmentId: string }) {
  const [submitting, setSubmitting] = useState(false);

  async function handleClick() {
    setSubmitting(true);
    const result = await createEcpayCheckout(enrollmentId);
    if (!result.success) {
      toast.error(result.error);
      setSubmitting(false);
      return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = result.actionUrl;
    for (const [name, value] of Object.entries(result.params)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = String(value);
      form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
  }

  return (
    <Button type="button" variant="outline" onClick={handleClick} disabled={submitting} className="w-full">
      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
      線上刷卡／ATM／超商付款
    </Button>
  );
}
