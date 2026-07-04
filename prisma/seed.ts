import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set — set it in .env before seeding.");
}
const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });

const DEV_PASSWORD = "Password123!";

async function main() {
  const passwordHash = await bcrypt.hash(DEV_PASSWORD, 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@mandaringo.dev" },
    update: {},
    create: {
      email: "superadmin@mandaringo.dev",
      passwordHash,
      role: "SUPER_ADMIN",
      name: "系統管理員",
      emailVerified: new Date(),
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@mandaringo.dev" },
    update: {},
    create: {
      email: "admin@mandaringo.dev",
      passwordHash,
      role: "ADMIN",
      name: "行政 Vivian",
      emailVerified: new Date(),
    },
  });

  const teacherUser = await prisma.user.upsert({
    where: { email: "teacher@mandaringo.dev" },
    update: {},
    create: {
      email: "teacher@mandaringo.dev",
      passwordHash,
      role: "TEACHER",
      name: "陳老師",
      emailVerified: new Date(),
    },
  });

  const teacher = await prisma.teacher.upsert({
    where: { email: "teacher@mandaringo.dev" },
    update: {},
    create: {
      userId: teacherUser.id,
      email: "teacher@mandaringo.dev",
      chineseFirstName: "怡君",
      chineseLastName: "陳",
      englishFirstName: "Yi-Jun",
      englishLastName: "Chen",
      gender: "FEMALE",
      phone: "0912345678",
      nationality: "台灣",
      postalCode: "10001",
      bio: "國立臺灣師範大學華語文教學研究所碩士，五年海外兒童華語教學經驗。",
    },
  });

  const parentUser = await prisma.user.upsert({
    where: { email: "parent@mandaringo.dev" },
    update: {},
    create: {
      email: "parent@mandaringo.dev",
      passwordHash,
      role: "PARENT",
      name: "王媽媽",
      emailVerified: new Date(),
    },
  });

  const parent = await prisma.parent.upsert({
    where: { email: "parent@mandaringo.dev" },
    update: {},
    create: {
      userId: parentUser.id,
      email: "parent@mandaringo.dev",
      chineseFirstName: "美玲",
      chineseLastName: "王",
      englishFirstName: "Mei-Ling",
      englishLastName: "Wang",
      gender: "FEMALE",
      phone: "0922333444",
      nationality: "英國／台灣",
      postalCode: "NW3 1RE",
      address: "Hampstead, London",
    },
  });

  let student = await prisma.student.findUnique({ where: { studentNumber: "202609A0001" } });
  if (!student) {
    student = await prisma.student.create({
      data: {
        studentNumber: "202609A0001",
        chineseFirstName: "小明",
        chineseLastName: "王",
        englishFirstName: "Ming",
        englishLastName: "Wang",
        gender: "MALE",
        birthDate: new Date("2018-05-20"),
      },
    });
    await prisma.parentStudent.create({
      data: { parentId: parent.id, studentId: student.id, relationship: "媽媽", isPrimary: true },
    });
  }

  const existingCourse = await prisma.course.findFirst({ where: { name: "注音好好玩" } });
  if (!existingCourse) {
    await prisma.course.create({
      data: {
        code: "202609LDNA001",
        name: "注音好好玩",
        description: "簡介注音好好玩，學習37個注音符號，適合零基礎的小朋友。",
        level: "LEVEL_1",
        fee: 13500,
        currency: "TWD",
        startDate: new Date("2026-09-01"),
        endDate: new Date("2026-12-15"),
        scheduleNote: "每週一次，每次 50 分鐘，使用 Zoom 上課。",
        region: "London",
        timezone: "Europe/London",
        dayOfWeek: 6,
        startTime: "10:00",
        minCapacity: 2,
        maxCapacity: 5,
        isPublished: true,
        primaryTeacherId: teacher.id,
        createdById: admin.id,
      },
    });
  }

  console.log("Seed complete.");
  console.log("Login with any of these (password: %s):", DEV_PASSWORD);
  console.log("  super admin:", superAdmin.email);
  console.log("  admin:      ", admin.email);
  console.log("  teacher:    ", teacherUser.email);
  console.log("  parent:     ", parentUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
