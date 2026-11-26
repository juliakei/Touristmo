import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'mysql2/promise';
import { DATABASE_POOL } from '../../database/database.module';

@Injectable()
export class AuthRepository {
  constructor(@Inject(DATABASE_POOL) private db: Pool) {}

  async findTouristByEmail(email: string) {
    const [rows]: any = await this.db.execute('SELECT * FROM tourists WHERE email = ?', [email]);
    return rows[0] || null;
  }

  async findAdminByEmail(email: string) {
    const [rows]: any = await this.db.execute('SELECT * FROM admins WHERE email = ?', [email]);
    return rows[0] || null;
  }

  async findGuideByEmail(email: string) {
    const [rows]: any = await this.db.execute('SELECT * FROM tour_guides WHERE email = ?', [email]);
    return rows[0] || null;
  }

  async createTourist(firstName: string, lastName: string, email: string, hashedPassword: string, phone: string) {
    const [result]: any = await this.db.execute(
      'INSERT INTO tourists (first_name, last_name, email, password_hash, phone) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, phone || null]
    );
    return result.insertId;
  }

  async findUserById(table: string, idField: string, id: number) {
    const [rows]: any = await this.db.execute(`SELECT * FROM ${table} WHERE ${idField} = ?`, [id]);
    return rows[0] || null;
  }
}
