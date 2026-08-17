import { Controller, Get } from '@nestjs/common';
import { programs } from './programs';

@Controller('general')
export class GeneralController {
  @Get('programs')
  getPeneral() {
    return { data: { ...programs } };
  }
}
