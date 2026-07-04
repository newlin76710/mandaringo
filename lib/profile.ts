import type { Prisma } from "@prisma/client";
import { generateStudentNumber } from "@/lib/codes";
import type { StudentProfileInput, ParentProfileInput, TeacherProfileInput } from "@/lib/schemas/auth";

type Tx = Prisma.TransactionClient;

export async function createStudentProfile(tx: Tx, userId: string | null, data: StudentProfileInput) {
  const studentNumber = await generateStudentNumber(tx);
  return tx.student.create({
    data: {
      userId,
      studentNumber,
      chineseFirstName: data.chineseFirstName,
      chineseLastName: data.chineseLastName,
      englishFirstName: data.englishFirstName,
      englishMiddleName: data.englishMiddleName || null,
      englishLastName: data.englishLastName,
      nickname: data.nickname || null,
      gender: data.gender,
      birthDate: new Date(data.birthDate),
      phone: data.phone || null,
      otherContact: data.otherContact || null,
      allergies: data.allergies || null,
      specialNeeds: data.specialNeeds || null,
      notes: data.notes || null,
    },
  });
}

export async function createParentProfile(tx: Tx, userId: string | null, email: string, data: ParentProfileInput) {
  return tx.parent.create({
    data: {
      userId,
      email,
      chineseFirstName: data.chineseFirstName,
      chineseLastName: data.chineseLastName,
      englishFirstName: data.englishFirstName,
      englishLastName: data.englishLastName,
      gender: data.gender,
      phone: data.phone,
      nationality: data.nationality,
      postalCode: data.postalCode,
      address: data.address || null,
      otherContact: data.otherContact || null,
      occupation: data.occupation || null,
      educationLevel: data.educationLevel || null,
      secondaryContactName: data.secondaryContactName || null,
      secondaryContactPhone: data.secondaryContactPhone || null,
      notes: data.notes || null,
    },
  });
}

export async function createTeacherProfile(tx: Tx, userId: string | null, email: string, data: TeacherProfileInput) {
  return tx.teacher.create({
    data: {
      userId,
      email,
      chineseFirstName: data.chineseFirstName,
      chineseLastName: data.chineseLastName,
      englishFirstName: data.englishFirstName,
      englishMiddleName: data.englishMiddleName || null,
      englishLastName: data.englishLastName,
      gender: data.gender,
      phone: data.phone,
      nationality: data.nationality,
      postalCode: data.postalCode,
      registeredAddress: data.registeredAddress || null,
      residentialAddress: data.residentialAddress || null,
      occupation: data.occupation || null,
      educationLevel: data.educationLevel || null,
      emergencyContactName: data.emergencyContactName || null,
      emergencyContactPhone: data.emergencyContactPhone || null,
      bio: data.bio || null,
    },
  });
}
