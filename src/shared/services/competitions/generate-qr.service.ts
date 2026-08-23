import { Injectable } from '@nestjs/common';
import { join } from 'path';
import QRCode from 'qrcode';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class QrCodeService {
  constructor(private readonly storageService: StorageService) {}

  async generateQrCode(data: string, fileName?: string): Promise<Buffer> {
    const relativePath = this.getQrCodePath(data, fileName);

    if (await this.storageService.exists(relativePath)) {
      return this.storageService.read(relativePath);
    }

    const buffer = await QRCode.toBuffer(data, {
      type: 'png',
      errorCorrectionLevel: 'M',
      width: 500,
      margin: 2,
    });

    await this.storageService.write(relativePath, buffer);

    return buffer;
  }

  private getQrCodePath(data: string, fileName?: string): string {
    const targetFileName = fileName ?? `${this.hashData(data)}.png`;
    return join('qrcodes', targetFileName);
  }

  private hashData(data: string): string {
    return Buffer.from(data).toString('base64url').replace(/=+$/g, '');
  }
}
