import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@modules/users/users.module';
import { PrismaModule } from '@infrastructure/prisma/prisma.module';
import { MailModule } from '@infrastructure/mail/mail.module';
import { AuthModule } from '@modules/auth/auth.module';
import { CompetitionModule } from '@modules/competition/competition.module';
import { RouterModule } from '@nestjs/core';
import { AdminModule } from '@modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    PrismaModule,
    MailModule,
    AuthModule,
    CompetitionModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
