import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

export type JwtTokenPayload = {
  userId: number;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<string> {
    const user = await this.userService.findOneFull({ email });
    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException();
    const payload: JwtTokenPayload = { userId: user.id, email: user.email };
    return await this.jwtService.signAsync(payload);
  }

  async signUp(
    email: string,
    password: string,
  ): Promise<string> {
    const user = await this.userService.create({ email, password });
    const payload: JwtTokenPayload = { userId: user.id, email: user.email };
    return await this.jwtService.signAsync(payload);
  }
}
