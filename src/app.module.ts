import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfigFactory } from './modules/database/typeorm.factory';
import appConfig from './modules/config/app.config';
import mailConfig from './modules/config/mail.config';
import databaseConfig from './modules/config/database.config';
import authConfig from './modules/config/auth.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigService } from './modules/mail/mailer-config.service';
import { TokenModule } from './modules/token/token.module';
import { PostModule } from './modules/post/post.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailerConfigService,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeORMConfigFactory }),
    AuthModule,
    UserModule,
    TokenModule,
    PostModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mailConfig, databaseConfig, authConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
