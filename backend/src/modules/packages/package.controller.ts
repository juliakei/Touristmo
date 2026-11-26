import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { PackageService } from './package.service';
import { AuthGuard, RolesGuard, Roles } from '../../common/guards/auth.guard';

@Controller('packages')
export class PackageController {
  constructor(private packageService: PackageService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllPackages(@Query('destinationId') destinationId: string, @Query('maxPrice') maxPrice: string) {
    const packages = await this.packageService.getAllPackages(destinationId, maxPrice);
    return {
      success: true,
      statusCode: 200,
      message: 'Packages retrieved successfully.',
      data: packages,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPackageById(@Param('id') id: string) {
    const pkg = await this.packageService.getPackageById(Number(id));
    return {
      success: true,
      statusCode: 200,
      message: 'Package retrieved successfully.',
      data: pkg,
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async createPackage(@Body() body: any) {
    const result = await this.packageService.createPackage(body);
    return {
      success: true,
      statusCode: 201,
      message: 'Package created successfully.',
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async updatePackage(@Param('id') id: string, @Body() body: any) {
    const result = await this.packageService.updatePackage(Number(id), body);
    return {
      success: true,
      statusCode: 200,
      message: 'Package updated successfully.',
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async deletePackage(@Param('id') id: string) {
    await this.packageService.deletePackage(Number(id));
    return {
      success: true,
      statusCode: 200,
      message: 'Package deleted successfully.',
      timestamp: new Date().toISOString(),
    };
  }
}
