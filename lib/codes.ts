import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import type { Prisma } from "@prisma/client";

type Db = Prisma.TransactionClient | typeof prisma;

function pad(num: number, size: number) {
  return String(num).padStart(size, "0");
}

/**
 * Student number: YYYYMM + region letter + 4-digit sequence, e.g. 202609A0001
 * (format confirmed against Sheet1's example).
 */
export async function generateStudentNumber(db: Db = prisma, enrollDate: Date = new Date(), region = "A") {
  const prefix = `${enrollDate.getFullYear()}${pad(enrollDate.getMonth() + 1, 2)}${region}`;
  const count = await db.student.count({
    where: { studentNumber: { startsWith: prefix } },
  });
  return `${prefix}${pad(count + 1, 4)}`;
}

/**
 * Course code: open-date(YYYYMM) + region code + level letter + 3-digit sequence,
 * e.g. 202609001A001 (開班日期＋地區＋課程種類＋第幾個班, Sheet1).
 */
export async function generateCourseCode(db: Db, startDate: Date, regionCode: string, levelLetter: string) {
  const prefix = `${startDate.getFullYear()}${pad(startDate.getMonth() + 1, 2)}${regionCode}${levelLetter}`;
  const count = await db.course.count({
    where: { code: { startsWith: prefix } },
  });
  return `${prefix}${pad(count + 1, 3)}`;
}

/** Enrollment code, used as the bank-transfer reference the payer quotes. */
export function generateEnrollmentCode(now: Date = new Date()) {
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}`;
  const randomPart = randomBytes(3).toString("hex").toUpperCase();
  return `MG${datePart}${randomPart}`;
}
