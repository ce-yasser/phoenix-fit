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
  gender: string;
  registrationId: string;
  qrCodeImage: Buffer<ArrayBufferLike>;
  statusUrl: string;
}

export interface RegistrationRejectedData {
  name?: string | null;
  level: string;
  gender: string;
  registrationId: string;
  rejectionReason: string;
  resubmitUrl: string;
}

export interface RegistrationReceivedData {
  name?: string | null;
  level: string;
  gender: string;
  amount: string;
  registrationId: string;
  statusUrl: string;
}
