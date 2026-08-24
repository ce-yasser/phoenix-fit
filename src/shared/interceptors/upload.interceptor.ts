import { BadRequestException, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadOptions } from '../interfaces';

export function UploadInterceptor(options: UploadOptions) {

  return UseInterceptors(
    FileInterceptor(options.fieldName, {
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
