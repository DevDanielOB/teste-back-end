import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from 'src/modules/user/interfaces/auth-jwt.interface';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async auth(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await this.userService.comparePasswords(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload: AuthPayload = { email: user.userEmail, sub: user.id };

    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  decodeToken(token: string): { email: string; id: string } {
    try {
      const decoded = this.jwtService.verify(token);
      const { email, sub: id } = decoded;

      if (!email || !id) {
        throw new UnauthorizedException('Invalid bearer token format');
      }

      return { email, id };
    } catch (e) {
      throw new UnauthorizedException(`Invalid token: ${e.message}`);
    }
  }
}
