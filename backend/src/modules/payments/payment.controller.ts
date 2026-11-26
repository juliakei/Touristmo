import { Controller, Get, Post, Req, Body, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard, RolesGuard, Roles } from '../../common/guards/auth.guard';

@Controller('payments')
@UseGuards(AuthGuard, RolesGuard)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllPayments(@Req() req: any) {
    const { userId, role } = req.user;
    const payments = await this.paymentService.getAllPayments(userId, role);
    return {
      success: true,
      statusCode: 200,
      message: 'Payments retrieved successfully.',
      data: payments,
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  @Roles('tourist')
  @HttpCode(HttpStatus.CREATED)
  async createPayment(@Body() body: any) {
    const result = await this.paymentService.createPayment(body);
    return {
      success: true,
      statusCode: 201,
      message: 'Payment processed successfully.',
      data: result,
      timestamp: new Date().toISOString(),
    };
  }
}
