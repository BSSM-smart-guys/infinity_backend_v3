import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './tokenPayload.interface';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  public getJwtToken(uid: number) {
    const payload: TokenPayload = { uid };
    const token = this.jwtService.sign(payload, {
      expiresIn: '12h',
      secret: process.env.SECRET_KEY,
    });
    console.log(1);
    return token;
  }

  validateUser(payload: any) {
    const user = this.userService.findOne(payload.uid);
    if (user) {
      return user;
    }
    throw new NotFoundException();
  }
}
