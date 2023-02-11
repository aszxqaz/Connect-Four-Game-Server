import { Controller, Get, UnauthorizedException } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  hello() {
    throw new UnauthorizedException()
  }
}