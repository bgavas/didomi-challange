import { Connection, createConnection } from 'typeorm';
import { TYPEORM } from '../config/config';
import { Environment } from '../utils/enums';
import { logger } from '../utils/logger';

export let connection: Connection;

if (process.env.NODE_ENV !== Environment.Test) {
  createConnection({
    type: TYPEORM.CONNECTION as any,
    host: TYPEORM.HOST,
    port: Number(TYPEORM.PORT),
    username: TYPEORM.USERNAME,
    password: TYPEORM.PASSWORD,
    database: TYPEORM.DATABASE,
    synchronize: true,
    logging: false,
    ssl: TYPEORM.SSL,
    entities: [
      `${__dirname}/entities/**/*.{ts,js}`,
    ],
    migrations: [
      `${__dirname}/migrations/**/*.{ts,js}`,
    ],
    cli: {
      entitiesDir: `${__dirname}/entities`,
      migrationsDir: `${__dirname}/migrations`,
    },
    extra: {
      ...(
        TYPEORM.SSL ? {
          ssl: {
            rejectUnauthorized: false,
          },
        } : {}
      ),
    },
  }).then((con) => {
    logger.info('Succesfully connected to the database');
    connection = con;
  }).catch((e) => {
    logger.error('Error occured while connecting to the db', e);
  });
}
