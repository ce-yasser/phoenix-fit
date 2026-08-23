import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../shared/guards/admin/admin.guard';

@UseGuards(AdminGuard)
export abstract class BaseAdminController {}
