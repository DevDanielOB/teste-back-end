import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserService } from 'src/modules/user/services/user.service';
import { UserController } from 'src/modules/user/controllers/user.controller';
import { JwtConfig } from './jwt-config';
import { AuthGuard } from './auth.guard';
import { env } from 'src/shared/environment';
import { usersProviders } from 'src/shared/providers';
import { UrlController } from 'src/modules/url/controllers/url.controller';
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
