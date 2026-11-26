import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DestinationRepository } from './destination.repository';

@Injectable()
export class DestinationService {
  constructor(private destinationRepository: DestinationRepository) {}

  async getAllDestinations(search: string, location: string) {
    return await this.destinationRepository.findAll(search, location);
  }

  async getDestinationById(id: number) {
    const destination = await this.destinationRepository.findById(id);
    if (!destination) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not found',
          errors: [`Destination with ID ${id} does not exist.`],
          timestamp: new Date().toISOString(),
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const packages = await this.destinationRepository.findPackagesByDestinationId(id);
    return {
      ...destination,
      packages,
    };
  }

  async createDestination(data: any) {
    const { name, description, location, priceGuide, imageUrl } = data;

    if (!name || !description || !location || !priceGuide) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation error',
          errors: ['Name, description, location, and priceGuide are required.'],
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const destinationId = await this.destinationRepository.create(name, description, location, priceGuide, imageUrl);
    return {
      destinationId,
      name,
      description,
      location,
      priceGuide,
      imageUrl,
    };
  }

  async updateDestination(id: number, data: any) {
    const existing = await this.destinationRepository.findById(id);
    if (!existing) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not found',
          errors: [`Destination with ID ${id} does not exist.`],
          timestamp: new Date().toISOString(),
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const { name, description, location, priceGuide, imageUrl } = data;

    const updatedName = name || existing.name;
    const updatedDescription = description || existing.description;
    const updatedLocation = location || existing.location;
    const updatedPriceGuide = priceGuide !== undefined ? priceGuide : existing.price_guide;
    const updatedImageUrl = imageUrl !== undefined ? imageUrl : existing.image_url;

    await this.destinationRepository.update(id, updatedName, updatedDescription, updatedLocation, updatedPriceGuide, updatedImageUrl);
    return { destinationId: id };
  }

  async deleteDestination(id: number) {
    const existing = await this.destinationRepository.findById(id);
    if (!existing) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not found',
          errors: [`Destination with ID ${id} does not exist.`],
          timestamp: new Date().toISOString(),
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.destinationRepository.delete(id);
  }
}
