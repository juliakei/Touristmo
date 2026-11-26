import { Controller, Get, Post, Patch, Param, Body, Req, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { BookingService } from './booking.service';
import { AuthGuard, RolesGuard, Roles } from '../../common/guards/auth.guard';

@Controller('bookings')
@UseGuards(AuthGuard, RolesGuard)
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllBookings(@Req() req: any) {
    const { userId, role } = req.user;
    const bookings = await this.bookingService.getAllBookings(userId, role);
    return {
      success: true,
      statusCode: 200,
      message: 'Bookings retrieved successfully.',
      data: bookings,
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  @Roles('tourist')
  @HttpCode(HttpStatus.CREATED)
  async createBooking(@Req() req: any, @Body() body: any) {
    const result = await this.bookingService.createBooking(req.user, body);
    return {
      success: true,
      statusCode: 201,
      message: 'Booking created successfully.',
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch(':id/status')
  @Roles('admin', 'guide')
  @HttpCode(HttpStatus.OK)
  async updateBookingStatus(@Param('id') id: string, @Body() body: any) {
    const result = await this.bookingService.updateBookingStatus(Number(id), body.status);
    return {
      success: true,
      statusCode: 200,
      message: 'Booking status updated successfully.',
      data: result,
      timestamp: new Date().toISOString(),
    };
  }
}
