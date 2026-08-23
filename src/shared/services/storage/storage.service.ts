import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { dirname, join } from 'path';

@Injectable()
export class StorageService {
  constructor(private readonly configService: ConfigService) {}

  async exists(relativePath: string): Promise<boolean> {
    const fullPath = this.resolvePath(relativePath);

    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  async read(relativePath: string): Promise<Buffer> {
    return fs.readFile(this.resolvePath(relativePath));
  }

  async write(relativePath: string, content: Buffer | string): Promise<void> {
    const fullPath = this.resolvePath(relativePath);

    await fs.mkdir(dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content);
  }

  async delete(relativePath: string): Promise<void> {
    const fullPath = this.resolvePath(relativePath);
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

  private resolvePath(relativePath: string): string {
    const uploadRoot = this.configService.get<string>('UPLOAD_PATH') || 'uploads';
    return join(process.cwd(), uploadRoot, relativePath);
  }
}
