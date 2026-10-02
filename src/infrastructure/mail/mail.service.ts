import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as otpTemplate from './templates/otp.template';
import * as confirmedTemplate from './templates/registration-confirmed.template';
import * as receivedTemplate from './templates/registration-received.template';
import * as rejectedTemplate from './templates/registration-rejected.template';
import Mailgun from 'mailgun.js';
import FormData from 'form-data';
import * as I from '../../shared/interfaces';

@Injectable()
export class MailService {
  private readonly client: ReturnType<Mailgun['client']>;
  private readonly domain: string;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    const mailgun = new Mailgun(FormData);

    this.client = mailgun.client({
      username: 'api',
      key: this.configService.getOrThrow<string>('MAILGUN_API_KEY'),
      url: this.configService.getOrThrow<string>('MAILGUN_BASE_URL'),
    });

    this.domain = this.configService.getOrThrow<string>('MAILGUN_DOMAIN');

    this.from = this.configService.getOrThrow<string>('MAILGUN_FROM');
  }

  async sendFromAdminToUser(email: string, context: I.MailContext) {
    await this.client.messages.create(this.domain, {
      from: this.from,
      to: [email],
      subject: this.getContextSubject(context),
      html: this.getContextTemplate(context),
      attachment: this.getAttachments(context),
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
            data: context.data.qrCodeImage,
          },
        ];
      default:
        return [];
    }
  }
}
