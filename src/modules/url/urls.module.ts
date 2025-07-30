import { Module } from '@nestjs/common';
import { UrlController } from './controllers/url.controller';
import { AuthModule } from 'src/auth/auth.module';
import { usersProviders } from 'src/shared/providers';

@Module({
  imports: [AuthModule],
  controllers: [UrlController],
  providers: [...usersProviders],
  exports: usersProviders,
})
export class UrlsModule {}
