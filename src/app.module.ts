import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './shared/database/database.module';
import { UsersModule } from './modules/user/users.module';
import { UrlsModule } from './modules/url/urls.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from 'nestjs-pino';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [DatabaseModule, UsersModule, UrlsModule, AuthModule, LoggerModule.forRoot(), PrometheusModule.register()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
