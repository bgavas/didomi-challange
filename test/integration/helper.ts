import { Connection, createConnection } from 'typeorm';
import { TYPEORM } from '../../src/config/config';

export const createDbConnection = async (): Promise<Connection> => {
  return createConnection({
    type: TYPEORM.CONNECTION as any,
    host: TYPEORM.HOST,
    port: Number(TYPEORM.PORT),
    username: TYPEORM.USERNAME,
    password: TYPEORM.PASSWORD,
    database: TYPEORM.DATABASE,
    synchronize: true,
    logging: false,
    entities: [
      `${__dirname}/../../src/db/entities/**/*.{ts,js}`,
    ],
  });
};
