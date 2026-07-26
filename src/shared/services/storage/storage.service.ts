import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class StorageService {
  constructor(private readonly configService: ConfigService) {}

  async delete(relativePath: string): Promise<void> {
    const uploadRoot = this.configService.get<string>('UPLOAD_PATH');

    const fullPath = join(process.cwd(), uploadRoot!, relativePath);
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
}
