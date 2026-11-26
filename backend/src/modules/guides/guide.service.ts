import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { GuideRepository } from './guide.repository';

@Injectable()
export class GuideService {
  constructor(private guideRepository: GuideRepository) {}

  async getAllGuides() {
    return await this.guideRepository.findAll();
  }

  async createGuide(data: any) {
    const { firstName, lastName, email, password, phone, specialization, bio } = data;

    if (!firstName || !lastName || !email || !password) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation error',
          errors: ['First name, last name, email, and password are required.'],
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const guideId = await this.guideRepository.create(
      firstName, lastName, email, hashedPassword, phone, specialization, bio
    );

    return {
      guideId,
      firstName,
      lastName,
      email,
    };
  }

  async updateGuideStatus(id: number, status: string) {
    if (!status) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation error',
          errors: ['Status is required.'],
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.guideRepository.updateStatus(id, status);
  }
}
