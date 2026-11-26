import { Module, Global } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

export const DATABASE_POOL = 'DATABASE_POOL';

const databaseProvider = {
  provide: DATABASE_POOL,
  useFactory: async () => {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'touristmo_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    try {
      const connection = await pool.getConnection();
      console.log('Database connected successfully to MySQL (NestJS).');
      connection.release();
    } catch (err: any) {
      console.error('Database connection failed:', err.message);
    }
    return pool;
  },
};

@Global()
@Module({
  providers: [databaseProvider],
  exports: [DATABASE_POOL],
})
export class DatabaseModule {}
