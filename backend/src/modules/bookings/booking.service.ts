import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BookingRepository } from './booking.repository';

@Injectable()
export class BookingService {
  constructor(private bookingRepository: BookingRepository) {}

  async getAllBookings(userId: number, role: string) {
    return await this.bookingRepository.findAll(userId, role);
  }

  async createBooking(user: any, body: any) {
    const { userId } = user;
    const { packageId, participantsCount } = body;

    if (!packageId || !participantsCount) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation error',
          errors: ['Package ID and participants count are required.'],
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const pkg = await this.bookingRepository.findPackageById(packageId);
    if (!pkg) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not found',
          errors: [`Package with ID ${packageId} does not exist.`],
          timestamp: new Date().toISOString(),
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const totalPrice = pkg.price * participantsCount;
    const bookingId = await this.bookingRepository.create(userId, packageId, participantsCount, totalPrice, 'Pending');

    return {
      bookingId,
      touristId: userId,
      packageId,
      participantsCount,
      totalPrice,
      status: 'Pending',
    };
  }

  async updateBookingStatus(bookingId: number, status: string) {
    if (!status || !['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation error',
          errors: ['Valid status (Pending, Confirmed, Cancelled) is required.'],
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const existing = await this.bookingRepository.findById(bookingId);
    if (!existing) {
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

    await this.bookingRepository.updateStatus(bookingId, status);
    return { bookingId, status };
  }
}
