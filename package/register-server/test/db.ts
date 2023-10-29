import { Fido2Credential, Mail, NostrAccount } from '../src/model';
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';

export class TestDatabase {
  private dataSource: DataSource;

  constructor() {}

  async init(): Promise<void> {
    this.dataSource = new DataSource({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'test',
      password: 'password',
      database: 'test',
      entities: [Fido2Credential, Mail, NostrAccount],
      synchronize: true, // only develop
    });

    await this.dataSource
      .initialize()
      .then(() => {
        console.log('Data Source has been initialized!');
      })
      .catch((err) => {
        console.error('Error during Data Source initialization', err);
      });
  }

  /**
   * getRepository
   */
  getRepository<T extends ObjectLiteral>(
    entity: EntityTarget<T>,
  ): Repository<T> {
    return this.dataSource.getRepository(entity);
  }

  async destroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}
