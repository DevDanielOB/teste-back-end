import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers['authorization'];

    if (!authorization) {
      return true;
    }

    if (!authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }

    const token = authorization.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
      request.token = token;
      return true;
    } catch {
      throw new UnauthorizedException('Token Bearer is invalid');
    }
  }
}
