import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Access denied. No token provided.',
          errors: ['Authentication token is missing from Authorization header.'],
          timestamp: new Date().toISOString(),
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const secret = process.env.JWT_SECRET || 'touristmo_super_secret_jwt_key_2026';
      const user = jwt.verify(token, secret);
      request.user = user; // { userId, email, role, name }
      return true;
    } catch (err: any) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Invalid or expired token.',
          errors: [err.message],
          timestamp: new Date().toISOString(),
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !requiredRoles.includes(user.role)) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Forbidden. Insufficient permissions for this role.',
          errors: [`Required role(s): ${requiredRoles.join(', ')}. Your role: ${user ? user.role : 'none'}`],
          timestamp: new Date().toISOString(),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
