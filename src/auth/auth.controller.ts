import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LocalGuard } from './local.guard';
import { RequestWithUser } from 'src/common/types';

@Controller('auth')
export class AuthController {
  @Post('login')
  @UseGuards(LocalGuard)
  public async login(@Req() req: RequestWithUser) {
    return {
      user: {
        username: req.user?.username,
      },
    };
  }

  @Get('me')
  public async me(@Req() req: RequestWithUser) {
    if (!req.user) {
      throw new UnauthorizedException('Not authorized');
    }
    return {
      user: {
        username: req.user.username,
      },
    };
  }
}
