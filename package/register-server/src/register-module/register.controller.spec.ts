import { Test, TestingModule } from '@nestjs/testing';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { RegisterModule } from './register.module';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Fido2Credential, Mail, NostrAccount } from '../model';
import { RedisService } from '../store/redis.service';
import { TestDatabase } from '../../test/db';

describe('RegisterController', () => {
  const db = new TestDatabase();
  const redis = new RedisService();

  let app: TestingModule;
  let registerService: RegisterService;

  beforeAll(async () => {
    await db.init();

    registerService = new RegisterService(
      db.getRepository(Fido2Credential),
      db.getRepository(Mail),
      db.getRepository(NostrAccount),
      redis,
    );

    app = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [
        { provide: RegisterService, useValue: registerService },
        RedisService,
      ],
    }).compile();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get(RegisterController);
      expect(appController).toBeDefined();
      // expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
