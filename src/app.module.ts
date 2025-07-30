import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './shared/database/database.module';
import { UsersModule } from './modules/user/users.module';
import { UrlsModule } from './modules/url/urls.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, UsersModule, UrlsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
