import type { Metadata } from "next";
import Link from "next/link";
import { Users, MapPin, Calendar } from "lucide-react";
import { getPublishedCourses } from "@/lib/queries/courses";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { COURSE_LEVEL_LABELS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import { LmsNav } from "@/components/lms/LmsNav";

export const metadata: Metadata = { title: "課程列表 - Mandarin Go" };
// Capacity counts change with every enrollment, and there's no DB available at build
// time in environments where DATABASE_URL isn't set yet — always render at request time.
export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await getPublishedCourses();

  return (
    <div className="min-h-screen bg-slate-50">
      <LmsNav />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-extrabold text-slate-900">目前開放報名的課程</h1>
        <p className="mt-1 text-sm text-slate-500">選擇課程即可查看詳細資訊並報名。</p>

        {courses.length === 0 ? (
          <p className="mt-10 text-center text-sm text-slate-400">目前沒有開放報名的課程，請稍後再回來看看。</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const full = course._count.enrollments >= course.maxCapacity;
              return (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant="info">{COURSE_LEVEL_LABELS[course.level]}</Badge>
                        {full && <Badge variant="danger">已額滿</Badge>}
                      </div>
                      <h2 className="mt-3 text-lg font-bold text-slate-900">{course.name}</h2>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">{course.description}</p>
                      <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          {course.primaryTeacher.chineseLastName}
                          {course.primaryTeacher.chineseFirstName} 老師 ·{" "}
                          {course._count.enrollments}/{course.maxCapacity} 人
                        </div>
                        {course.region && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {course.region}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(course.startDate)} - {formatDate(course.endDate)}
                        </div>
                      </div>
                      <div className="mt-4 text-lg font-extrabold text-sky-600">
                        {formatCurrency(course.fee.toString(), course.currency)}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
