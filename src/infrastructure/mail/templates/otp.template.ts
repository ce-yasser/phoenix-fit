import * as I from '../../../shared/interfaces';
import { BaseEmailTemplate } from './base-email.template';

export function template(data: I.MailOtpData): string {
  const expiryMinutes = Number(data.expiry || 10);

  return BaseEmailTemplate.build({
    title: 'Verify your email',
    name: data.name ?? null,
    body: `Use the code below to verify your email and continue with your registration for the <strong>Phoenix Fit Calisthenics Championship</strong>.<br /><br />
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f4f5; border:1px dashed #d8d8d8; border-radius:10px; margin: 0 auto;">
        <tr>
          <td align="center" style="padding: 24px;">
            <span style="font-family: 'Courier New', Courier, monospace; font-size:38px; font-weight:bold; letter-spacing:12px; color:#c1440e;">
              ${data.otp}
            </span>
          </td>
        </tr>
      </table><br />
      <p style="margin:0 0 8px; font-size:14px; line-height:1.6; color:#6b6b6b;">
        This code expires in <strong>${expiryMinutes} minutes</strong>.
      </p>
      <p style="margin:0; font-size:14px; line-height:1.6; color:#6b6b6b;">
        If you didn&rsquo;t request this code, you can safely ignore this email.
      </p>`,
    supportMessage: 'Need help?',
    preheader: `Your verification code is ${data.otp} — it expires in ${expiryMinutes} minutes.`,
  });
}

export function subject(data: I.MailOtpData): string {
  return `Phoenix Fit - Your OTP Code is ${data.otp}`;
}
