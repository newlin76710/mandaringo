import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActiveToggleButton } from "@/components/lms/admin/ActiveToggleButton";
import { setParentActive } from "@/app/actions/admin-users";
import { GENDER_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminParentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parent = await prisma.parent.findUnique({
    where: { id },
    include: { students: { include: { student: true } } },
  });
  if (!parent) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-900">
          {parent.chineseLastName}
          {parent.chineseFirstName}
        </h1>
        <ActiveToggleButton id={parent.id} isActive={parent.isActive} action={setParentActive} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本資料</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <Field label="性別" value={GENDER_LABELS[parent.gender]} />
            <Field label="電話" value={parent.phone} />
            <Field label="Email" value={parent.email} />
            <Field label="國籍／居住地" value={parent.nationality} />
            <Field label="地址" value={parent.address} />
            <Field label="其他聯繫方式" value={parent.otherContact} />
            <Field label="次要聯繫人" value={parent.secondaryContactName} />
            <Field label="次要聯繫人電話" value={parent.secondaryContactPhone} />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>連結學生</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {parent.students.length === 0 ? (
            <p className="text-sm text-slate-400">尚未連結學生</p>
          ) : (
            parent.students.map((ps) => (
              <Link
                key={ps.id}
                href={`/admin/students/${ps.student.id}`}
                className="flex items-center justify-between text-sm text-slate-700 hover:text-sky-600"
              >
                <span>
                  {ps.student.chineseLastName}
                  {ps.student.chineseFirstName}（{ps.relationship}）
                </span>
                <span className="text-slate-400">{ps.student.studentNumber}</span>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="font-medium text-slate-700">{value || "—"}</dd>
    </div>
  );
}
