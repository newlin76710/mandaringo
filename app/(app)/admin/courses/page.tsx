import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listCoursesForAdmin } from "@/lib/queries/admin-lists";
import { CoursesTable } from "@/components/lms/admin/CoursesTable";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "課程管理 - Mandarin Go" };
export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const courses = await listCoursesForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-900">課程管理 ({courses.length})</h1>
        <Button asChild size="sm">
          <Link href="/admin/courses/new">
            <Plus className="h-4 w-4" />
            開新課程
          </Link>
        </Button>
      </div>
      <CoursesTable courses={courses} />
    </div>
  );
}
