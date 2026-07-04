"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-center"
      toastOptions={{
        style: { fontFamily: "var(--font-tc), system-ui, sans-serif" },
      }}
    />
  );
}
