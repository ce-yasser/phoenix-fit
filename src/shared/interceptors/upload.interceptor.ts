import { BadRequestException, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { UploadOptions } from '@interfaces';
import { ConfigService } from '@nestjs/config';

export function UploadInterceptor(options: UploadOptions) {
  return UseInterceptors(
    FileInterceptor(options.fieldName, {
      storage: diskStorage({
        destination:
          new ConfigService().get('UPLOAD_PATH') + options.destination,

        filename: (req, file, callback) => {
          const extension = extname(file.originalname);

          callback(null, `${randomUUID()}${extension}`);
        },
      }),

      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = options.allowedMimeTypes;

        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              `Only ${allowedMimeTypes.join(', ')} files are allowed.`,
            ),
            false,
          );
        }

        callback(null, true);
      },

      limits: {
        fileSize: options.maxSize,
      },
    }),
  );
}
