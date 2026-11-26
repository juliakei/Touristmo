import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'mysql2/promise';
import { DATABASE_POOL } from '../../database/database.module';

@Injectable()
export class BookingRepository {
  constructor(@Inject(DATABASE_POOL) private db: Pool) {}

  async findAll(userId: number, role: string) {
    let query = `
      SELECT b.*, t.first_name as tourist_first_name, t.last_name as tourist_last_name, t.email as tourist_email,
             p.title as package_title, p.price as package_price, d.name as destination_name
      FROM bookings b
      JOIN tourists t ON b.tourist_id = t.tourist_id
      JOIN packages p ON b.package_id = p.package_id
      JOIN destinations d ON p.destination_id = d.destination_id
    `;
    let params: any[] = [];

    if (role === 'tourist') {
      query += ' WHERE b.tourist_id = ?';
      params.push(userId);
    }

    query += ' ORDER BY b.created_at DESC';

    const [bookings]: any = await this.db.execute(query, params);
    return bookings;
  }

  async findPackageById(packageId: number) {
    const [rows]: any = await this.db.execute('SELECT * FROM packages WHERE package_id = ?', [packageId]);
    return rows[0] || null;
  }

  async findById(bookingId: number) {
    const [rows]: any = await this.db.execute('SELECT * FROM bookings WHERE booking_id = ?', [bookingId]);
    return rows[0] || null;
  }

  async create(touristId: number, packageId: number, participantsCount: number, totalPrice: number, status: string) {
    const [result]: any = await this.db.execute(
      'INSERT INTO bookings (tourist_id, package_id, participants_count, total_price, status) VALUES (?, ?, ?, ?, ?)',
      [touristId, packageId, participantsCount, totalPrice, status]
    );
    return result.insertId;
  }

  async updateStatus(bookingId: number, status: string) {
    await this.db.execute('UPDATE bookings SET status = ? WHERE booking_id = ?', [status, bookingId]);
  }
}
