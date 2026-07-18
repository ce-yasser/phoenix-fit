import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import * as otpTemplate from './templates/otp.template';
import * as I from '@interfaces';

@Injectable()
export class MailService {
  private readonly resend = new Resend(process.env.RESEND_API_KEY);

  async sendFromAdminToUser(email: string, context: I.MailContext) {
    await this.resend.emails.send({
      from: process.env.EMAIL_FROM || '',
      to: email,
      subject: this.getContextSubject(context),
      html: this.getContextTemplate(context)
    });
  }

  private getContextTemplate(context: I.MailContext): string {
    switch (context.type) {
      case 'otp':
        return otpTemplate.template(context.data);
      default:
        throw new Error('Unknown mail context type');
    }
  }

  private getContextSubject(context: I.MailContext): string {
    switch (context.type) {
      case 'register':
        return 'Welcome to Phoenix Fit - Verify Your Email';
      case 'otp':
        return otpTemplate.subject();
      default:
        throw new Error('Unknown mail context type');
    }
  }

}
