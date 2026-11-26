import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentRepository } from './payment.repository';

@Injectable()
export class PaymentService {
  constructor(private paymentRepository: PaymentRepository) {}

  async getAllPayments(userId: number, role: string) {
    return await this.paymentRepository.findAll(userId, role);
  }

  async createPayment(body: any) {
    const { bookingId, amount, paymentMethod } = body;

    if (!bookingId || !amount || !paymentMethod) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation error',
          errors: ['Booking ID, amount, and payment method are required.'],
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const booking = await this.paymentRepository.findBookingById(bookingId);
    if (!booking) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not found',
          errors: [`Booking with ID ${bookingId} does not exist.`],
          timestamp: new Date().toISOString(),
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const paymentId = await this.paymentRepository.create(bookingId, amount, paymentMethod, 'Completed');
    await this.paymentRepository.updateBookingStatus(bookingId, 'Confirmed');

    return {
      paymentId,
      bookingId,
      amount,
      paymentMethod,
      paymentStatus: 'Completed',
    };
  }
}
