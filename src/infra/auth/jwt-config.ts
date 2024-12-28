import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/features/users/services/user.service';
import { env } from '../core/environment';

@Injectable()
export class JwtConfig extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.getUserByEmail(payload.email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
