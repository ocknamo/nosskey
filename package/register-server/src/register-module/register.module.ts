import { Module } from '@nestjs/common';
import { RedisService } from '../store/redis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fido2Credential, Mail, NostrAccount } from '../model';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';

@Module({
  imports: [TypeOrmModule.forFeature([Fido2Credential, Mail, NostrAccount])],
  controllers: [RegisterController],
  providers: [RegisterService, RedisService],
})
export class RegisterModule {}
