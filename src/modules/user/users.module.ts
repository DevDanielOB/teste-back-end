import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { usersProviders } from 'src/shared/providers';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [...usersProviders],
  exports: usersProviders,
})
export class UsersModule {}
