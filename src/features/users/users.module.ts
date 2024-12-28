import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { usersProviders } from '../providers';
import { AuthModule } from 'src/infra/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [...usersProviders],
  exports: usersProviders,
})
export class UsersModule {}
