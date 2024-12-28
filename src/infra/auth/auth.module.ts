import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserService } from 'src/features/users/services/user.service';
import { UserController } from 'src/features/users/controllers/user.controller';
import { JwtConfig } from './jwt-config';
import { usersProviders } from 'src/features/providers';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtConfig, UserService, ...usersProviders],
  controllers: [UserController],
  exports: [AuthService],
})
export class AuthModule {}
