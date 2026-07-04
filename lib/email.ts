import { Resend } from "resend";

const FROM = process.env.FROM_EMAIL ?? "Mandarin Go <onboarding@resend.dev>";

function getClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

/**
 * Sends transactional email via Resend. If RESEND_API_KEY isn't configured yet, this
 * logs instead of throwing — the surrounding flow (registration, payment confirmation,
 * etc.) still completes; the founder can add the key later without any code changes.
 */
export async function sendEmail(opts: { to: string; subject: string; html: string }) {
  const client = getClient();
  if (!client) {
    console.warn(`[email:not-configured] to=${opts.to} subject="${opts.subject}"`);
    return { skipped: true as const };
  }

  const { error } = await client.emails.send({
    from: FROM,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });

  if (error) {
    console.error("[email:send-failed]", error);
    return { skipped: false as const, error };
  }
  return { skipped: false as const };
}

export function verificationEmailHtml(verifyUrl: string) {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>歡迎加入 Mandarin Go</h2>
      <p>請點擊下方連結完成 Email 驗證：</p>
      <p><a href="${verifyUrl}" style="display:inline-block;background:#0fb6ef;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">驗證我的 Email</a></p>
      <p style="color:#888;font-size:13px">此連結 48 小時內有效。若非您本人操作，請忽略此信。</p>
    </div>`;
}

export function passwordResetEmailHtml(resetUrl: string) {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>重設您的密碼</h2>
      <p>請點擊下方連結重新設定密碼：</p>
      <p><a href="${resetUrl}" style="display:inline-block;background:#0fb6ef;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">重設密碼</a></p>
      <p style="color:#888;font-size:13px">此連結 2 小時內有效。若非您本人操作，請忽略此信。</p>
    </div>`;
}

export function enrollmentConfirmedEmailHtml(courseName: string, studentName: string) {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>報名已確認！</h2>
      <p>${studentName} 的「${courseName}」課程繳費已確認，開始上課囉！</p>
    </div>`;
}

export function enrollmentRejectedEmailHtml(courseName: string, studentName: string, reason?: string | null) {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>付款確認未通過</h2>
      <p>${studentName} 的「${courseName}」報名付款確認未通過。</p>
      ${reason ? `<p>原因：${reason}</p>` : ""}
      <p>如有疑問，請直接回覆此信與我們聯繫。</p>
    </div>`;
}
