import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'mysql2/promise';
import { DATABASE_POOL } from '../../database/database.module';

@Injectable()
export class PaymentRepository {
  constructor(@Inject(DATABASE_POOL) private db: Pool) {}

  async findAll(userId: number, role: string) {
    let query = `
      SELECT pay.*, b.tourist_id, b.total_price, t.first_name, t.last_name, p.title as package_title
      FROM payments pay
      JOIN bookings b ON pay.booking_id = b.booking_id
      JOIN tourists t ON b.tourist_id = t.tourist_id
      JOIN packages p ON b.package_id = p.package_id
    `;
    let params: any[] = [];

    if (role === 'tourist') {
      query += ' WHERE b.tourist_id = ?';
      params.push(userId);
    }

    query += ' ORDER BY pay.transaction_date DESC';

    const [payments]: any = await this.db.execute(query, params);
    return payments;
  }

  async findBookingById(bookingId: number) {
    const [bookingRows]: any = await this.db.execute('SELECT * FROM bookings WHERE booking_id = ?', [bookingId]);
    return bookingRows[0] || null;
  }

  async create(bookingId: number, amount: number, paymentMethod: string, paymentStatus: string) {
    const [result]: any = await this.db.execute(
      'INSERT INTO payments (booking_id, amount, payment_method, payment_status) VALUES (?, ?, ?, ?)',
      [bookingId, amount, paymentMethod, paymentStatus]
    );
    return result.insertId;
  }

  async updateBookingStatus(bookingId: number, status: string) {
    await this.db.execute('UPDATE bookings SET status = ? WHERE booking_id = ?', [status, bookingId]);
  }
}
