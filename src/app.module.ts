import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infra/database/database.module';
import { UsersModule } from './features/users/users.module';
import { AuthModule } from './infra/auth/auth.module';
import { UrlsModule } from './features/urls/urls.module';

@Module({
  imports: [DatabaseModule, UsersModule, UrlsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
