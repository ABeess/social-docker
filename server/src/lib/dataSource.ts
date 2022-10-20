import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...(process.env.NODE_ENV === 'production' && {
    host: 'postgres',
  }),
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // logging: true,
  synchronize: true,
  cache: true,
  entities: ['dist/entities/*.js'],
});
