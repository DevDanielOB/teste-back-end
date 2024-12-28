import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserService } from 'src/features/users/services/user.service';
import { UserController } from 'src/features/users/controllers/user.controller';
import { JwtConfig } from './jwt-config';
import { usersProviders } from 'src/features/providers';
import { AuthGuard } from './auth.guard';
import { UrlController } from 'src/features/urls/controllers/url.controller';
import { env } from '../core/environment';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: env.jwtSecret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    JwtConfig,
    UserService,
    ...usersProviders,
    AuthGuard,
  ],
  controllers: [UserController, UrlController],
  exports: [AuthService, AuthGuard, JwtModule],
})
export class AuthModule {}
