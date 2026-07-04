import type { Role, Gender, CourseLevel, EnrollmentStatus, PaymentStatus, AttendanceStatus, LeaveStatus } from "@prisma/client";

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "最高管理員",
  ADMIN: "行政人員",
  TEACHER: "老師",
  PARENT: "家長",
  STUDENT: "學生",
};

// Student is deliberately excluded — Student profiles are created by a Parent
// (see app/actions/family.ts), not self-registered.
export const REGISTERABLE_ROLES = ["TEACHER", "PARENT"] as const;
export type RegisterableRole = (typeof REGISTERABLE_ROLES)[number];

export const GENDER_LABELS: Record<Gender, string> = {
  MALE: "男",
  FEMALE: "女",
  OTHER: "其他",
};

export const COURSE_LEVEL_LABELS: Record<CourseLevel, string> = {
  LEVEL_1: "Level 1：主題中文",
  LEVEL_2: "Level 2：漢字好好玩",
  LEVEL_3: "Level 3：小學國語",
  LEVEL_4: "Level 4：中學華語",
  LEVEL_5: "Level 5：大學／成人",
};

export const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  PENDING_PAYMENT: "待付款",
  CONFIRMING: "待確認匯款",
  ACTIVE: "上課中",
  CANCELLED: "已取消",
  WITHDRAWN: "已退班",
};

export const ENROLLMENT_STATUS_BADGE: Record<EnrollmentStatus, "default" | "warning" | "success" | "danger" | "info"> = {
  PENDING_PAYMENT: "warning",
  CONFIRMING: "info",
  ACTIVE: "success",
  CANCELLED: "danger",
  WITHDRAWN: "default",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "待付款",
  CONFIRMING: "待確認",
  PAID: "已付款",
  CANCELLED: "已取消",
};

export const PAYMENT_STATUS_BADGE: Record<PaymentStatus, "default" | "warning" | "success" | "danger" | "info"> = {
  PENDING: "warning",
  CONFIRMING: "info",
  PAID: "success",
  CANCELLED: "danger",
};

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  PRESENT: "出席",
  LATE: "遲到",
  ABSENT: "缺席",
  EXCUSED: "請假",
};

export const ATTENDANCE_STATUS_BADGE: Record<AttendanceStatus, "default" | "warning" | "success" | "danger" | "info"> = {
  PRESENT: "success",
  LATE: "warning",
  ABSENT: "danger",
  EXCUSED: "info",
};

export const LEAVE_STATUS_LABELS: Record<LeaveStatus, string> = {
  SUBMITTED: "審核中",
  APPROVED: "已核准",
  REJECTED: "已駁回",
};

export const LEAVE_STATUS_BADGE: Record<LeaveStatus, "default" | "warning" | "success" | "danger" | "info"> = {
  SUBMITTED: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

export const DAY_OF_WEEK_LABELS = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
