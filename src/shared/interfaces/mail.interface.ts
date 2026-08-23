export type MailContext =
  | { type: 'otp'; data: MailOtpData }
  | { type: 'registration-received'; data: RegistrationReceivedData }
  | { type: 'registration-confirmed'; data: RegistrationConfirmedData }
  | { type: 'registration-rejected'; data: RegistrationRejectedData };

export interface MailOtpData {
  otp: string;
  expiry?: string | number;
  name?: string | null;
}

export interface RegistrationConfirmedData {
  name?: string | null;
  level: string;
  category: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  registrationId: string;
  qrCodeUrl: string;
  statusUrl: string;
}

export interface RegistrationReceivedData {
  name?: string | null;
  level: string;
  category: string;
  amount: string;
  registrationId: string;
  statusUrl: string;
}

export interface RegistrationRejectedData {
  name?: string | null;
  level: string;
  category: string;
  registrationId: string;
  rejectionReason: string;
  resubmitUrl: string;
}
