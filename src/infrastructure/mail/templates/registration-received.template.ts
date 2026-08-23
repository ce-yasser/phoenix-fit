import * as I from '@interfaces';
import { BaseEmailTemplate } from './base-email.template';

export function template(data: I.RegistrationReceivedData): string {
  const body = `
    Thanks for submitting your payment proof for the <strong>Phoenix Fit Calisthenics Championship</strong>. Your registration is now pending review &mdash; an admin will verify your payment and confirm your spot shortly. We&rsquo;ll email you as soon as it&rsquo;s approved.
    <br /><br />
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
              <td style="padding:6px 0; font-size:13px; color:#8a8a8a;">Amount Paid</td>
              <td align="right" style="padding:6px 0; font-size:13px; font-weight:bold; color:#f2790a;">${data.amount} EGP</td>
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
    <div style="text-align:center;">
      <a href="${data.statusUrl}" style="background-color:#f2790a; color:#ffffff; display:inline-block; font-family: Arial, Helvetica, sans-serif; font-size:15px; font-weight:bold; padding:14px 32px; border-radius:8px;">
        View Registration Status
      </a>
    </div>
  `;

  return BaseEmailTemplate.build({
    title: 'We&rsquo;ve received your payment',
    name: data.name ?? null,
    body,
    status: 'Pending Review',
    supportMessage: 'Questions about your registration?',
    preheader: `We've received your payment for ${data.level} • ${data.category} — pending admin approval.`,
    
  });
}

export function subject(data: I.RegistrationReceivedData): string {
  return `Phoenix Fit - Payment Received for ${data.level}`;
}
