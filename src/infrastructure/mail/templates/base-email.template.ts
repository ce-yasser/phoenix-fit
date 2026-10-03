import { ConfigService } from '@nestjs/config';

export interface EmailContentOptions {
  title: string;
  name?: string | null;
  body: string;
}

export interface BuildEmailTemplateOptions {
  title: string;
  name?: string | null;
  body: string;
  status?: string;
  supportMessage?: string;
  preheader?: string;
  isRejection?: boolean;
}

export class BaseEmailTemplate {
  static build({
    title,
    name,
    body,
    status,
    supportMessage,
    preheader,
    isRejection = false,
  }: BuildEmailTemplateOptions): string {
    return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
    <title>${escapeHtml(title)}</title>
    <style>
      body, table, td { font-family: 'Barlow', Arial, Helvetica, sans-serif; }
      body { margin: 0; padding: 0; background-color: #f4f4f5; -webkit-text-size-adjust: 100%; }
      table { border-collapse: collapse; }
      img { border: 0; display: block; }
      a { text-decoration: none; }
      @media only screen and (max-width: 600px) {
        .pf-container { width: 100% !important; }
        .pf-px { padding-left: 24px !important; padding-right: 24px !important; }
        .pf-stack td { display: block !important; width: 100% !important; text-align: left !important; padding-bottom: 4px !important; }
      }
    </style>
  </head>
  <body>
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
      ${escapeHtml(preheader ?? title)}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <table role="presentation" class="pf-container" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #ececec;">
            ${this.renderHeader(status, isRejection)}
            ${this.renderContent({ title, name, body })}
            ${this.renderFooter(supportMessage)}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `.trim();
  }

  static renderHeader(status: string = '', isRejection: boolean = false): string {
    const logo = new ConfigService().get<string>('logo');
    const statusColor = isRejection ? '#ef4444' : '#1e8a44';
    const statusRow = status
      ? `
        <tr>
          <td align="center" style="background-color:#eaf7ee; padding: 12px 24px; border-bottom:1px solid #cdedd6;">
            <span style="font-family: Arial, Helvetica, sans-serif; font-size:12px; font-weight:bold; letter-spacing:0.05em; text-transform:uppercase; color:${statusColor};">
              &#9679;&nbsp; ${escapeHtml(status)}
            </span>
          </td>
        </tr>
      `
      : '';

    return `
      <tr>
        <td align="center" style="background-color:#121212; padding: 28px 24px;">
          <img src="${logo}" width="56" alt="Phoenix Fit" style="display:block; margin:0 auto 8px;" />
          <span style="font-family: Arial, Helvetica, sans-serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#f2790a; font-weight:bold;">Phoenix Fit</span>
        </td>
      </tr>
      ${statusRow}
    `;
  }

  static renderContent({ title, name, body }: EmailContentOptions): string {
    const greeting = name ? `Hi ${escapeHtml(name)},` : 'Hi there,';

    return `
      <tr>
        <td class="pf-px" style="padding: 40px 40px 8px;">
          <h1 style="margin:0 0 16px; font-family: Arial, Helvetica, sans-serif; font-size:22px; line-height:1.3; color:#1f1f1f;">
            ${title}
          </h1>
          <p style="margin:0 0 24px; font-size:15px; line-height:1.6; color:#4b4b4b;">
            ${greeting}<br /><br />
            ${body}
          </p>
        </td>
      </tr>
    `;
  }

  static renderFooter(supportMessage = 'Need help?'): string {
    const whatsappNumber = new ConfigService().get<number>('whatsapp');
    return `
      <tr>
        <td style="padding: 0 40px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="border-top:1px solid #ececec; font-size:0; line-height:0;">&nbsp;</td></tr>
          </table>
        </td>
      </tr>

      <tr>
        <td align="center" class="pf-px" style="padding: 24px 40px 40px;">
          <p style="margin:0; font-size:13px; line-height:1.6; color:#8a8a8a;">
            ${supportMessage} Reach us on WhatsApp
            <a href="https://wa.me/${whatsappNumber}" style="color:#f2790a; font-weight:bold;">${whatsappNumber}</a>.
          </p>
        </td>
      </tr>

      <tr>
        <td align="center" style="background-color:#f9f9f9; padding: 20px 24px; border-top:1px solid #ececec;">
          <p style="margin:0; font-size:12px; color:#a3a3a3;">
            &copy; 2026 Phoenix Fit., Alexandria.
          </p>
        </td>
      </tr>
    `;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
