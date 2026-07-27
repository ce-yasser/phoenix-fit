import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '@guards/admin/admin.guard';

@UseGuards(AdminGuard)
export abstract class BaseAdminController {}
