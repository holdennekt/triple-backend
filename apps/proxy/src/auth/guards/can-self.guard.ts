import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtTokenPayload } from '../auth.service';

@Injectable()
export class CanSelfGuard implements CanActivate {
  constructor(
    private getUserId: (req: Request) => string
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request & { user: JwtTokenPayload } = context
      .switchToHttp()
      .getRequest();
    return request.user.userId === parseInt(this.getUserId(request));
  }
}
