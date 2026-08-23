import * as I from '@interfaces';
import { BaseEmailTemplate } from './base-email.template';

export function template(data: I.RegistrationRejectedData): string {
  const body = `
    Unfortunately, we were unable to approve your registration for the
    <strong>Phoenix Fit Calisthenics Championship</strong>. Here&rsquo;s why:
    <br /><br />
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdecec; border-left:4px solid #ef4444; border-radius:6px;">
      <tr>
        <td style="padding: 16px 20px;">
          <p style="margin:0; font-size:14px; line-height:1.6; color:#9a2a26;">
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
              <td style="padding:6px 0; font-size:13px; color:#8a8a8a;">Level</td>
              <td align="right" style="padding:6px 0; font-size:13px; font-weight:bold; color:#1f1f1f;">${data.level}</td>
            </tr>
            <tr class="pf-stack">
              <td style="padding:6px 0; font-size:13px; color:#8a8a8a;">Category</td>
              <td align="right" style="padding:6px 0; font-size:13px; font-weight:bold; color:#1f1f1f;">${data.category}</td>
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
      You&rsquo;re welcome to resubmit your payment proof, or reach out if you think this was a mistake &mdash; we&rsquo;re happy to help sort it out.
    </p>
    <br />
    <div style="text-align:center;">
      <a href="${data.resubmitUrl}" style="background-color:#f2790a; color:#ffffff; display:inline-block; font-family: Arial, Helvetica, sans-serif; font-size:15px; font-weight:bold; padding:14px 32px; border-radius:8px;">
        Resubmit Payment Proof
      </a>
    </div>
  `;

  return BaseEmailTemplate.build({
    title: 'We couldn&rsquo;t approve your registration',
    name: data.name ?? null,
    body,
    status: 'Registration Not Approved',
    supportMessage: 'Think this was a mistake?',
    preheader: `Your registration for ${data.level} • ${data.category} could not be approved.`,
  });
}

export function subject(data: I.RegistrationRejectedData): string {
  return `Phoenix Fit - Registration Update for ${data.level}`;
}
