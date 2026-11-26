import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'mysql2/promise';
import { DATABASE_POOL } from '../../database/database.module';

@Injectable()
export class GuideRepository {
  constructor(@Inject(DATABASE_POOL) private db: Pool) {}

  async findAll() {
    const [guides]: any = await this.db.execute('SELECT guide_id, first_name, last_name, email, phone, specialization, bio, status, created_at FROM tour_guides');
    return guides;
  }

  async findById(id: number) {
    const [rows]: any = await this.db.execute('SELECT * FROM tour_guides WHERE guide_id = ?', [id]);
    return rows[0] || null;
  }

  async create(firstName: string, lastName: string, email: string, hashedPassword: string, phone: string, specialization: string, bio: string) {
    const [result]: any = await this.db.execute(
      'INSERT INTO tour_guides (first_name, last_name, email, password_hash, phone, specialization, bio, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, phone || null, specialization || null, bio || null, 'Active']
    );
    return result.insertId;
  }

  async updateStatus(id: number, status: string) {
    await this.db.execute('UPDATE tour_guides SET status = ? WHERE guide_id = ?', [status, id]);
  }
}
