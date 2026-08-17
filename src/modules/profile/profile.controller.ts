import { Controller, Get, Put, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from '@guards/jwt-auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { CurrentUser } from '@decorators/current-user.decorator';
import type { JwtPayload } from '@interfaces';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@CurrentUser() user: JwtPayload) {
    return this.profileService.getProfile(user.sub);
  }

  @Put()
  updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(user.sub, updateProfileDto);
  }
}
