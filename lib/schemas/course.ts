import { z } from "zod";

export const courseSchema = z.object({
  name: z.string().min(1, "請輸入課程名稱"),
  description: z.string().optional(),
  level: z.enum(["LEVEL_1", "LEVEL_2", "LEVEL_3", "LEVEL_4", "LEVEL_5"]),
  fee: z.coerce.number().positive("請輸入有效金額"),
  currency: z.string().min(1).default("TWD"),
  startDate: z.string().refine((d) => !isNaN(Date.parse(d)), "請輸入有效日期"),
  endDate: z.string().refine((d) => !isNaN(Date.parse(d)), "請輸入有效日期"),
  scheduleNote: z.string().optional(),
  region: z.string().optional(),
  regionCode: z.string().min(1, "請輸入地區代碼（如 LDN）").max(4).optional(),
  timezone: z.string().optional(),
  dayOfWeek: z.coerce.number().int().min(0).max(6).optional(),
  startTime: z.string().optional(),
  minCapacity: z.coerce.number().int().min(1).default(2),
  maxCapacity: z.coerce.number().int().min(1).default(5),
  materialUrl: z.string().optional(),
  isPublished: z.boolean().default(false),
  primaryTeacherId: z.string().min(1, "請選擇主要老師"),
});
export type CourseInput = z.output<typeof courseSchema>;
// react-hook-form must be typed against the *input* shape when a schema uses
// z.coerce (fee/minCapacity/maxCapacity/dayOfWeek accept string input from <input>
// elements and coerce to number on parse) — the output type has already-coerced
// number fields, which mismatches what the form actually holds before submission.
export type CourseFormValues = z.input<typeof courseSchema>;
