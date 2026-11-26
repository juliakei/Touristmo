import { Controller, Get, Post, Patch, Param, Body, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { GuideService } from './guide.service';
import { AuthGuard, RolesGuard, Roles } from '../../common/guards/auth.guard';

@Controller('tour-guides')
export class GuideController {
  constructor(private guideService: GuideService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllGuides() {
    const guides = await this.guideService.getAllGuides();
    return {
      success: true,
      statusCode: 200,
      message: 'Tour guides retrieved successfully.',
      data: guides,
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createGuide(@Body() body: any) {
    const result = await this.guideService.createGuide(body);
    return {
      success: true,
      statusCode: 201,
      message: 'Tour guide registered successfully.',
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async updateGuideStatus(@Param('id') id: string, @Body() body: any) {
    await this.guideService.updateGuideStatus(Number(id), body.status);
    return {
      success: true,
      statusCode: 200,
      message: 'Tour guide status updated successfully.',
      timestamp: new Date().toISOString(),
    };
  }
}
