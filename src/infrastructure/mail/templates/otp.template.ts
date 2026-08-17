import * as I from '@interfaces';

export function template(data: I.MailOtpData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2>Welcome to Phoenix Fit.</h2>

      <p>Your verification code is:</p>

      <h1 style="letter-spacing: 6px;">
        ${data.otp}
      </h1>

      <p>
        This code will expire after <strong>1 minute</strong>.
      </p>

      <p>
        If you didn't request this email, you can safely ignore it.
      </p>
    </div>
  `;
}

export function subject(data: I.MailOtpData): string {
  return `Phoenix Fit - Your OTP Code is ${data.otp}`;
}
