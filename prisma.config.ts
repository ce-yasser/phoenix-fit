import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { defineConfig } from 'prisma/config';

const configService = new ConfigService();

export default defineConfig({
  schema: 'prisma/',
  datasource: {
    url: configService.get<string>('DATABASE_URL')!,
  },
});
