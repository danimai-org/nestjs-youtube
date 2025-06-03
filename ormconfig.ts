import { DataSource } from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const configs: SqliteConnectionOptions = {
  type: 'sqlite',
  database: 'sql.db',
  entities: [__dirname + '/src/**/*.entity.{ts,js}'],
  dropSchema: false,
  logging: false,
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
};
const dataSource = new DataSource(configs);

export default dataSource;
