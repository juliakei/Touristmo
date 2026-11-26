import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'mysql2/promise';
import { DATABASE_POOL } from '../../database/database.module';

@Injectable()
export class DestinationRepository {
  constructor(@Inject(DATABASE_POOL) private db: Pool) {}

  async findAll(search: string, location: string) {
    let query = 'SELECT * FROM destinations WHERE 1=1';
    let params: any[] = [];

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (location) {
      query += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }

    query += ' ORDER BY created_at DESC';

    const [destinations]: any = await this.db.execute(query, params);
    return destinations;
  }

  async findById(id: number) {
    const [rows]: any = await this.db.execute('SELECT * FROM destinations WHERE destination_id = ?', [id]);
    return rows[0] || null;
  }

  async findPackagesByDestinationId(id: number) {
    const [packages]: any = await this.db.execute('SELECT * FROM packages WHERE destination_id = ?', [id]);
    return packages;
  }

  async create(name: string, description: string, location: string, priceGuide: number, imageUrl: string) {
    const [result]: any = await this.db.execute(
      'INSERT INTO destinations (name, description, location, price_guide, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, description, location, priceGuide, imageUrl || null]
    );
    return result.insertId;
  }

  async update(id: number, name: string, description: string, location: string, priceGuide: number, imageUrl: string) {
    await this.db.execute(
      'UPDATE destinations SET name = ?, description = ?, location = ?, price_guide = ?, image_url = ? WHERE destination_id = ?',
      [name, description, location, priceGuide, imageUrl, id]
    );
  }

  async delete(id: number) {
    await this.db.execute('DELETE FROM destinations WHERE destination_id = ?', [id]);
  }
}
