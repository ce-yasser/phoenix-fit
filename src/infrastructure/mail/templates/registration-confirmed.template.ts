import * as I from '@interfaces';
import { BaseEmailTemplate } from './base-email.template';
import { ConfigService } from '@nestjs/config';

export function template(data: I.RegistrationConfirmedData): string {
  const configService = new ConfigService();
  const eventDate = configService.get<string>('EVENT_DATE') || '';
  const eventTime = configService.get<string>('EVENT_TIME') || '';
  const eventVenue = configService.get<string>('EVENT_VENUE') || '';

  const body = `
    Great news &mdash; your registration has been approved and confirmed for the
    <strong>Phoenix Fit Calisthenics Championship</strong>. See you on the bars.
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
              <td style="padding:6px 0; font-size:13px; color:#8a8a8a;">Date</td>
              <td align="right" style="padding:6px 0; font-size:13px; font-weight:bold; color:#1f1f1f;">${eventDate}</td>
            </tr>
            <tr class="pf-stack">
              <td style="padding:6px 0; font-size:13px; color:#8a8a8a;">Time</td>
              <td align="right" style="padding:6px 0; font-size:13px; font-weight:bold; color:#1f1f1f;">${eventTime}</td>
            </tr>
            <tr class="pf-stack">
              <td style="padding:6px 0; font-size:13px; color:#8a8a8a;">Venue</td>
              <td align="right" style="padding:6px 0; font-size:13px; font-weight:bold; color:#1f1f1f;">${eventVenue}</td>
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
    <table role="presentation" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border:2px solid #121212; border-radius:12px; margin: 0 auto;">
      <tr>
        <td align="center" style="padding: 20px;">
          <img src="${data.qrCodeUrl}" width="180" height="180" alt="Check-in QR code for ${data.registrationId}" style="display:block; width:180px; height:180px;" />
        </td>
      </tr>
    </table>
    <br />
    <p style="margin:0; font-size:13px; line-height:1.6; color:#8a8a8a;">
      Show this QR code at check-in on event day. Save this email or take a screenshot &mdash; you&rsquo;ll need it at the gate.
    </p>
    <br />
    <div style="text-align:center;">
      <a href="${data.statusUrl}" style="background-color:#f2790a; color:#ffffff; display:inline-block; font-family: Arial, Helvetica, sans-serif; font-size:15px; font-weight:bold; padding:14px 32px; border-radius:8px;">
        View Full Details
      </a>
    </div>
  `;

  return BaseEmailTemplate.build({
    title: 'You&rsquo;re confirmed',
    name: data.name ?? null,
    body,
    status: 'Registration Confirmed',
    supportMessage: 'Questions before event day?',
    preheader: `You're confirmed for ${data.level} • ${data.category}. Your check-in QR code is inside.`,
  });
}

export function subject(data: I.RegistrationConfirmedData): string {
  return `Phoenix Fit - Registration Confirmed for ${data.level}`;
}
