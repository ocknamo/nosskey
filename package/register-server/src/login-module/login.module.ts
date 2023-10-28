import { Module } from '@nestjs/common';
import { RedisService } from '../store/redis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fido2Credential, Mail, NostrAccount } from '../model';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [TypeOrmModule.forFeature([Fido2Credential, Mail, NostrAccount])],
  controllers: [LoginController],
  providers: [LoginService, RedisService],
})
export class LoginModule {}
