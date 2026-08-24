import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { promises as fs } from 'fs';
import { dirname, join } from 'path';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client | null;
  private readonly bucketName: string | null;
  private readonly driver: string;

  constructor(private readonly configService: ConfigService) {
    this.driver =
      this.configService.get<string>('STORAGE_DRIVER')?.toLowerCase() ||
      'local';

    const accountId = this.configService.get<string>('R2_ACCOUNT_ID');
    const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'R2_SECRET_ACCESS_KEY',
    );
    const bucketName = this.configService.get<string>('R2_BUCKET_NAME');

    if (
      this.driver === 'r2' &&
      accountId &&
      accessKeyId &&
      secretAccessKey &&
      bucketName
    ) {
      this.s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.bucketName = bucketName;
    } else {
      this.s3Client = null;
      this.bucketName = null;
    }
  }

  async exists(relativePath: string): Promise<boolean> {
    if (this.driver === 'r2') {
      return this.r2Exists(relativePath);
    }

    const fullPath = this.resolveLocalPath(relativePath);

    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  async read(relativePath: string): Promise<Buffer> {
    if (this.driver === 'r2') {
      return this.r2Read(relativePath);
    }

    return fs.readFile(this.resolveLocalPath(relativePath));
  }

  async write(relativePath: string, content: Buffer | string): Promise<void> {
    if (this.driver === 'r2') {
      await this.r2Write(relativePath, content);
      return;
    }

    const fullPath = this.resolveLocalPath(relativePath);

    await fs.mkdir(dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content);
  }

  async delete(relativePath: string): Promise<void> {
    if (this.driver === 'r2') {
      await this.r2Delete(relativePath);
      return;
    }

    const fullPath = this.resolveLocalPath(relativePath);
    try {
      await fs.unlink(fullPath);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return;
      }

      throw new InternalServerErrorException(
        `Failed to delete file: ${relativePath}`,
      );
    }
  }

  private async r2Exists(relativePath: string): Promise<boolean> {
    if (!this.s3Client || !this.bucketName) {
      return false;
    }

    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: this.normalizeKey(relativePath),
        }),
      );

      return true;
    } catch (error: any) {
      if (
        error?.name === 'NotFound' ||
        error?.$metadata?.httpStatusCode === 404
      ) {
        return false;
      }

      throw new InternalServerErrorException(
        `Failed to check file existence in R2: ${relativePath}`,
      );
    }
  }

  private async r2Read(relativePath: string): Promise<Buffer> {
    if (!this.s3Client || !this.bucketName) {
      throw new InternalServerErrorException('R2 storage is not configured.');
    }

    const response = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key: this.normalizeKey(relativePath),
      }),
    );

    const body = response.Body as
      AsyncIterable<Uint8Array> | Uint8Array | Buffer | string | undefined;

    if (!body) {
      throw new InternalServerErrorException(
        `File not found in R2: ${relativePath}`,
      );
    }

    const chunks: Buffer[] = [];

    if (typeof body === 'string') {
      return Buffer.from(body);
    }

    if (Buffer.isBuffer(body)) {
      return body;
    }

    if (body instanceof Uint8Array) {
      return Buffer.from(body);
    }

    for await (const chunk of body) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    return Buffer.concat(chunks);
  }

  private async r2Write(
    relativePath: string,
    content: Buffer | string,
  ): Promise<void> {
    if (!this.s3Client || !this.bucketName) {
      throw new InternalServerErrorException('R2 storage is not configured.');
    }

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: this.normalizeKey(relativePath),
        Body: content,
        ContentType: this.getContentType(relativePath),
      }),
    );
  }

  private async r2Delete(relativePath: string): Promise<void> {
    if (!this.s3Client || !this.bucketName) {
      return;
    }

    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: this.normalizeKey(relativePath),
        }),
      );
    } catch (error: any) {
      if (
        error?.name === 'NotFound' ||
        error?.$metadata?.httpStatusCode === 404
      ) {
        return;
      }

      throw new InternalServerErrorException(
        `Failed to delete file from R2: ${relativePath}`,
      );
    }
  }

  private normalizeKey(relativePath: string): string {
    return relativePath.replace(/\\/g, '/').replace(/^\/+/, '');
  }

  private getContentType(relativePath: string): string {
    const extension = relativePath.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'webp':
        return 'image/webp';
      case 'gif':
        return 'image/gif';
      default:
        return 'application/octet-stream';
    }
  }

  private resolveLocalPath(relativePath: string): string {
    const uploadRoot =
      this.configService.get<string>('UPLOAD_PATH') || 'uploads';
    return join(process.cwd(), uploadRoot, relativePath);
  }
}
