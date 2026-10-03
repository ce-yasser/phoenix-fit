import * as I from '../../../shared/interfaces';
import { BaseEmailTemplate } from './base-email.template';

export function template(data: I.RegistrationRejectedData): string {
  const body = `
    Your registration for the
    <strong>Phoenix Fit Calisthenics Championship</strong> has been canceled.
    <br /><br />
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fef2f2; border-left:4px solid #dc2626; border-radius:6px;">
      <tr>
        <td style="padding: 16px 20px;">
          <p style="margin:0; font-size:14px; line-height:1.6; color:#991b1b;">
            ${data.rejectionReason}
          </p>
        </td>
      </tr>
    </table>
    <br />
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9; border:1px solid #ececec; border-radius:10px;">
      <tr>
        <td style="padding: 20px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr class="pf-stack">
              <td style="padding:6px 0; font-size:13px; color:#8a8a8a;">Gender</td>
              <td align="right" style="padding:6px 0; font-size:13px; font-weight:bold; color:#1f1f1f;">${data.gender}</td>
            </tr>
            <tr class="pf-stack">
              <td style="padding:6px 0; font-size:13px; color:#8a8a8a;">Level</td>
              <td align="right" style="padding:6px 0; font-size:13px; font-weight:bold; color:#1f1f1f;">${data.level}</td>
            </tr>
            <tr class="pf-stack">
              <td style="padding:6px 0; font-size:13px; color:#8a8a8a;">Reference</td>
              <td align="right" style="padding:6px 0; font-size:13px; font-weight:bold; color:#1f1f1f;">${data.registrationId}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <br />
    <p style="margin:0; font-size:14px; line-height:1.6; color:#4b4b4b;">
      If you would like to re-activate your registration, please contact our support team.
    </p>
    <br />
    <div style="text-align:center;">
      <a href="${data.resubmitUrl}" style="background-color:#f2790a; color:#ffffff; display:inline-block; font-family: Arial, Helvetica, sans-serif; font-size:15px; font-weight:bold; padding:14px 32px; border-radius:8px;">
        View Registration
      </a>
    </div>
  `;

  return BaseEmailTemplate.build({
    title: 'Your registration has been canceled',
    name: data.name ?? null,
    body,
    status: 'Registration Canceled',
    supportMessage: 'Need help?',
    preheader: `Your registration for ${data.gender} • ${data.level} has been canceled.`,
    isRejection: true,
  });
}

export function subject(data: I.RegistrationRejectedData): string {
  return `Phoenix Fit - Registration Canceled for ${data.level}`;
}
