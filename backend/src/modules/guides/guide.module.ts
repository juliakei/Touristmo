import { Module } from '@nestjs/common';
import { GuideController } from './guide.controller';
import { GuideService } from './guide.service';
import { GuideRepository } from './guide.repository';

@Module({
  controllers: [GuideController],
  providers: [GuideService, GuideRepository],
  exports: [GuideService],
})
export class GuideModule {}
