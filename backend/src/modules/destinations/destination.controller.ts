import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { DestinationService } from './destination.service';
import { AuthGuard, RolesGuard, Roles } from '../../common/guards/auth.guard';

@Controller('destinations')
export class DestinationController {
  constructor(private destinationService: DestinationService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllDestinations(@Query('search') search: string, @Query('location') location: string) {
    const destinations = await this.destinationService.getAllDestinations(search, location);
    return {
      success: true,
      statusCode: 200,
      message: 'Destinations retrieved successfully.',
      data: destinations,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getDestinationById(@Param('id') id: string) {
    const destination = await this.destinationService.getDestinationById(Number(id));
    return {
      success: true,
      statusCode: 200,
      message: 'Destination retrieved successfully.',
      data: destination,
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async createDestination(@Body() body: any) {
    const result = await this.destinationService.createDestination(body);
    return {
      success: true,
      statusCode: 201,
      message: 'Destination created successfully.',
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async updateDestination(@Param('id') id: string, @Body() body: any) {
    const result = await this.destinationService.updateDestination(Number(id), body);
    return {
      success: true,
      statusCode: 200,
      message: 'Destination updated successfully.',
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async deleteDestination(@Param('id') id: string) {
    await this.destinationService.deleteDestination(Number(id));
    return {
      success: true,
      statusCode: 200,
      message: 'Destination deleted successfully.',
      timestamp: new Date().toISOString(),
    };
  }
}
