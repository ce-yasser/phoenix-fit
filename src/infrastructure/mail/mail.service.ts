import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as otpTemplate from './templates/otp.template';
import * as confirmedTemplate from './templates/registration-confirmed.template';
import * as receivedTemplate from './templates/registration-received.template';
import * as rejectedTemplate from './templates/registration-rejected.template';
import Mailgun from 'mailgun.js';
import FormData from 'form-data';
import { Resend } from 'resend';
import * as I from '../../shared/interfaces';
@Injectable()
export class MailService {
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');

    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not set. Add it to your .env file.');
    }
    this.resend = new Resend(apiKey);
  }

  async sendFromAdminToUser(email: string, context: I.MailContext) {
    await this.resend.emails.send({
      from: this.configService.get<string>('EMAIL_FROM') || '',
      to: email,
      subject: this.getContextSubject(context),
      html: this.getContextTemplate(context),
      attachments: this.getAttachments(context),
    });
  }

  private getContextTemplate(context: I.MailContext): string {
    switch (context.type) {
      case 'otp':
        return otpTemplate.template(context.data);
      case 'registration-confirmed':
        return confirmedTemplate.template(context.data);
      case 'registration-received':
        return receivedTemplate.template(context.data);
      case 'registration-rejected':
        return rejectedTemplate.template(context.data);
      default:
        throw new Error('Unknown mail context type');
    }
  }

  private getContextSubject(context: I.MailContext): string {
    switch (context.type) {
      case 'otp':
        return otpTemplate.subject(context.data);
      case 'registration-confirmed':
        return confirmedTemplate.subject(context.data);
      case 'registration-received':
        return receivedTemplate.subject(context.data);
      case 'registration-rejected':
        return rejectedTemplate.subject(context.data);
      default:
        throw new Error('Unknown mail context type');
    }
  }

  private getAttachments(context: I.MailContext) {
    switch (context.type) {
      case 'registration-confirmed':
        return [
          {
            filename: `${context.data.registrationId}.png`,
            content: context.data.qrCodeImage,
            contentType: 'image/png',
          },
        ];
      default:
        return [];
    }
  }
}
