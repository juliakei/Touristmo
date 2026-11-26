import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'mysql2/promise';
import { DATABASE_POOL } from '../../database/database.module';

@Injectable()
export class PackageRepository {
  constructor(@Inject(DATABASE_POOL) private db: Pool) {}

  async findAll(destinationId: string, maxPrice: string) {
    let query = `
      SELECT p.*, d.name as destination_name, d.location
      FROM packages p
      JOIN destinations d ON p.destination_id = d.destination_id
      WHERE 1=1
    `;
    let params: any[] = [];

    if (destinationId) {
      query += ' AND p.destination_id = ?';
      params.push(destinationId);
    }
    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(maxPrice);
    }

    query += ' ORDER BY p.start_date ASC';

    const [packages]: any = await this.db.execute(query, params);
    return packages;
  }

  async findById(id: number) {
    const [rows]: any = await this.db.execute(`
      SELECT p.*, d.name as destination_name, d.location, d.image_url
      FROM packages p
      JOIN destinations d ON p.destination_id = d.destination_id
      WHERE p.package_id = ?
    `, [id]);
    return rows[0] || null;
  }

  async create(destinationId: number, title: string, description: string, price: number, durationDays: number, maxParticipants: number, startDate: string) {
    const [result]: any = await this.db.execute(
      'INSERT INTO packages (destination_id, title, description, price, duration_days, max_participants, start_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [destinationId, title, description, price, durationDays, maxParticipants, startDate]
    );
    return result.insertId;
  }

  async update(id: number, destinationId: number, title: string, description: string, price: number, durationDays: number, maxParticipants: number, startDate: string) {
    await this.db.execute(
      'UPDATE packages SET destination_id = ?, title = ?, description = ?, price = ?, duration_days = ?, max_participants = ?, start_date = ? WHERE package_id = ?',
      [destinationId, title, description, price, durationDays, maxParticipants, startDate, id]
    );
  }

  async delete(id: number) {
    await this.db.execute('DELETE FROM packages WHERE package_id = ?', [id]);
  }
}
