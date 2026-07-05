import { z } from "zod";

export const emailSchema = z.string().min(1, "請輸入 Email").email("請輸入有效的 Email");
export const passwordSchema = z.string().min(8, "密碼至少 8 個字元");
// A contact email field that's optional, but must be a valid address when provided.
const optionalEmailSchema = z.union([z.literal(""), emailSchema]).optional();

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
  email: optionalEmailSchema,
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

// Parent.email is a required, unique column set from the login email at registration —
// separate from the base schema so registerSchema/onboardingSchema (which collect that
// email at the top level, not inside `profile`) don't end up requiring it twice.
export const parentProfileEditSchema = parentProfileSchema.extend({ email: emailSchema });
export type ParentProfileEditInput = z.infer<typeof parentProfileEditSchema>;

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

// Teacher.email is a required, unique column set from the login email at registration —
// kept out of the base schema for the same reason as parentProfileEditSchema above.
export const teacherProfileEditSchema = teacherProfileSchema.extend({ email: emailSchema });
export type TeacherProfileEditInput = z.infer<typeof teacherProfileEditSchema>;

// Self-registration only offers Parent or Teacher — Student profiles are created by a
// Parent (see app/actions/family.ts), not self-registered.
export const registerSchema = z.discriminatedUnion("role", [
  z.object({ role: z.literal("PARENT"), email: emailSchema, password: passwordSchema, profile: parentProfileSchema }),
  z.object({
    role: z.literal("TEACHER"),
    email: emailSchema,
    password: passwordSchema,
    teacherAccessCode: z.string().min(1, "請輸入老師註冊密碼"),
    profile: teacherProfileSchema,
  }),
]);
export type RegisterInput = z.infer<typeof registerSchema>;

export const onboardingSchema = z.discriminatedUnion("role", [
  // `email` is collected here too (not just read off the session) because an OAuth
  // provider isn't guaranteed to return one (e.g. LINE without the email scope granted,
  // or a user declining Facebook's email permission) — completeOnboarding falls back to
  // this value both as the Parent/Teacher contact email and to backfill User.email.
  z.object({ role: z.literal("PARENT"), email: emailSchema, profile: parentProfileSchema }),
  z.object({
    role: z.literal("TEACHER"),
    email: emailSchema,
    // Optional here (unlike registerSchema): an Admin/Super Admin completing their
    // default Teacher profile doesn't need the access code — see completeOnboarding,
    // which enforces it server-side only for accounts that aren't already Admin+.
    teacherAccessCode: z.string().optional(),
    profile: teacherProfileSchema,
  }),
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
