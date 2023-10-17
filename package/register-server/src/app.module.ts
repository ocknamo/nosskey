import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisService } from './store/redis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fido2Credential, Mail, NostrAccount } from './model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'test',
      password: 'password',
      database: 'test',
      entities: [Fido2Credential, Mail, NostrAccount],
      synchronize: true, // only develop
    }),
    TypeOrmModule.forFeature([Fido2Credential, Mail, NostrAccount]),
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
