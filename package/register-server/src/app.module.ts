import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fido2Credential, Mail, NostrAccount } from './model';
import { RegisterModule } from './register-module/register.module';
import { LoginModule } from './login-module/login.module';

@Module({
  imports: [
    RegisterModule,
    LoginModule,
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
  ],
})
export class AppModule {}
