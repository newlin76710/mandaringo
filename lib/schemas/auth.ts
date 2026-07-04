import { z } from "zod";

export const emailSchema = z.string().min(1, "請輸入 Email").email("請輸入有效的 Email");
export const passwordSchema = z.string().min(8, "密碼至少 8 個字元");

// Fields marked 必要 (required) in Sheet1 for a Student profile.
export const studentProfileSchema = z.object({
  chineseFirstName: z.string().min(1, "請輸入中文名字"),
  chineseLastName: z.string().min(1, "請輸入中文姓氏"),
  englishFirstName: z.string().min(1, "請輸入英文名字"),
  englishMiddleName: z.string().optional(),
  englishLastName: z.string().min(1, "請輸入英文姓氏"),
  nickname: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  birthDate: z.string().refine((d) => !isNaN(Date.parse(d)), "請輸入有效日期"),
  phone: z.string().optional(),
  otherContact: z.string().optional(),
  allergies: z.string().optional(),
  specialNeeds: z.string().optional(),
  notes: z.string().optional(),
});
export type StudentProfileInput = z.infer<typeof studentProfileSchema>;

// Fields marked 必要 for a Parent profile.
export const parentProfileSchema = z.object({
  chineseFirstName: z.string().min(1, "請輸入中文名字"),
  chineseLastName: z.string().min(1, "請輸入中文姓氏"),
  englishFirstName: z.string().min(1, "請輸入英文名字"),
  englishLastName: z.string().min(1, "請輸入英文姓氏"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  phone: z.string().min(1, "請輸入電話"),
  nationality: z.string().min(1, "請輸入國籍／居住地"),
  postalCode: z.string().min(1, "請輸入郵遞區號"),
  address: z.string().optional(),
  otherContact: z.string().optional(),
  occupation: z.string().optional(),
  educationLevel: z.string().optional(),
  secondaryContactName: z.string().optional(),
  secondaryContactPhone: z.string().optional(),
  notes: z.string().optional(),
});
export type ParentProfileInput = z.infer<typeof parentProfileSchema>;

// Fields marked 必要 for a Teacher profile.
export const teacherProfileSchema = z.object({
  chineseFirstName: z.string().min(1, "請輸入中文名字"),
  chineseLastName: z.string().min(1, "請輸入中文姓氏"),
  englishFirstName: z.string().min(1, "請輸入英文名字"),
  englishMiddleName: z.string().optional(),
  englishLastName: z.string().min(1, "請輸入英文姓氏"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  phone: z.string().min(1, "請輸入電話"),
  nationality: z.string().min(1, "請輸入國籍／居住地"),
  postalCode: z.string().min(1, "請輸入郵遞區號"),
  registeredAddress: z.string().optional(),
  residentialAddress: z.string().optional(),
  occupation: z.string().optional(),
  educationLevel: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  bio: z.string().optional(),
});
export type TeacherProfileInput = z.infer<typeof teacherProfileSchema>;

export const registerSchema = z.discriminatedUnion("role", [
  z.object({ role: z.literal("STUDENT"), email: emailSchema, password: passwordSchema, profile: studentProfileSchema }),
  z.object({ role: z.literal("PARENT"), email: emailSchema, password: passwordSchema, profile: parentProfileSchema }),
  z.object({ role: z.literal("TEACHER"), email: emailSchema, password: passwordSchema, profile: teacherProfileSchema }),
]);
export type RegisterInput = z.infer<typeof registerSchema>;

export const onboardingSchema = z.discriminatedUnion("role", [
  z.object({ role: z.literal("STUDENT"), profile: studentProfileSchema }),
  z.object({ role: z.literal("PARENT"), profile: parentProfileSchema }),
  z.object({ role: z.literal("TEACHER"), profile: teacherProfileSchema }),
]);
export type OnboardingInput = z.infer<typeof onboardingSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "請輸入密碼"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "兩次輸入的密碼不一致",
    path: ["confirmPassword"],
  });
