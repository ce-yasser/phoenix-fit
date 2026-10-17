import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from './generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL');
    if (!connectionString || typeof connectionString !== 'string') {
      throw new Error('DATABASE_URL is not set. Add it to your .env file.');
    }

    const pool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 20 * 60 * 1000,
      connectionTimeoutMillis: 5_000,
    });

    const adapter = new PrismaPg(pool);

    super({
      adapter,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
