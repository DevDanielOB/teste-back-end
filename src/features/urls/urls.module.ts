import { Module } from '@nestjs/common';
import { usersProviders } from '../providers';
import { AuthModule } from 'src/infra/auth/auth.module';
import { UrlController } from './controllers/url.controller';

@Module({
  imports: [AuthModule],
  controllers: [UrlController],
  providers: [...usersProviders],
  exports: usersProviders,
})
export class UrlsModule {}
