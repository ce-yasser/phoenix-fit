export interface MailContext {
  type: 'register' | 'otp';
  data: MailOtpData;
}

export interface MailOtpData {
  otp: string;
}
