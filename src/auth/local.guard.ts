import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log(request.body)
    request.body.password = "12345"
    const result = (await super.canActivate(context)) as boolean;
    await super.logIn(request);
    return result;
  }
}
