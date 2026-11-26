import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PackageRepository } from './package.repository';

@Injectable()
export class PackageService {
  constructor(private packageRepository: PackageRepository) {}

  async getAllPackages(destinationId: string, maxPrice: string) {
    return await this.packageRepository.findAll(destinationId, maxPrice);
  }

  async getPackageById(id: number) {
    const pkg = await this.packageRepository.findById(id);
    if (!pkg) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not found',
          errors: [`Package with ID ${id} does not exist.`],
          timestamp: new Date().toISOString(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return pkg;
  }

  async createPackage(data: any) {
    const { destinationId, title, description, price, durationDays, maxParticipants, startDate } = data;

    if (!destinationId || !title || !description || !price || !durationDays || !maxParticipants || !startDate) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation error',
          errors: ['All package fields are required.'],
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const packageId = await this.packageRepository.create(
      destinationId, title, description, price, durationDays, maxParticipants, startDate
    );

    return {
      packageId,
      title,
      price,
    };
  }

  async updatePackage(id: number, data: any) {
    const existing = await this.packageRepository.findById(id);
    if (!existing) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not found',
          errors: [`Package with ID ${id} does not exist.`],
          timestamp: new Date().toISOString(),
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const { destinationId, title, description, price, durationDays, maxParticipants, startDate } = data;

    await this.packageRepository.update(
      id,
      destinationId || existing.destination_id,
      title || existing.title,
      description || existing.description,
      price !== undefined ? price : existing.price,
      durationDays || existing.duration_days,
      maxParticipants || existing.max_participants,
      startDate || existing.start_date
    );

    return { packageId: id };
  }

  async deletePackage(id: number) {
    const existing = await this.packageRepository.findById(id);
    if (!existing) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not found',
          errors: [`Package with ID ${id} does not exist.`],
          timestamp: new Date().toISOString(),
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.packageRepository.delete(id);
  }
}
