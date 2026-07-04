import type { Metadata } from "next";
import { RegisterView } from "@/components/lms/RegisterView";

export const metadata: Metadata = { title: "註冊帳號 - Mandarin Go" };

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white px-4 py-16">
      <RegisterView />
    </div>
  );
}
