import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { DestinationModule } from './modules/destinations/destination.module';
import { PackageModule } from './modules/packages/package.module';
import { GuideModule } from './modules/guides/guide.module';
import { BookingModule } from './modules/bookings/booking.module';
import { PaymentModule } from './modules/payments/payment.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    DestinationModule,
    PackageModule,
    GuideModule,
    BookingModule,
    PaymentModule,
  ],
})
export class AppModule {}
