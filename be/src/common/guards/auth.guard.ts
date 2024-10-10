import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
// import * as config from 'config';
import { Reflector } from '@nestjs/core';
import { Role } from './role.helper';

@Injectable()
export class AuthGuard implements CanActivate {
  // constructor(private readonly u: InternalCacheService) {}
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const Authorization = request.get('Authorization');
    if (!Authorization) {
      throw new UnauthorizedException('Unauthorized request. Kindly login');
    }
    const token = Authorization.split(' ');
    if (!((token[1] && token[0] === 'Bearer') || token[0] === 'bearer')) {
      throw new UnauthorizedException('Unauthorized request. Kindly login');
    }

    let decrypt;
    try {
      const jwt_secret = process.env.JWT_SECRET;
      decrypt = await verify(token[1], jwt_secret);
    } catch (e) {
      throw new UnauthorizedException('Unauthorized request. Kindly login');
    }

    if (!decrypt) {
      throw new UnauthorizedException('Unauthorized request. Kindly login');
    }

    request.user = {
      id: decrypt.sub,
      role: decrypt.role,
    };
    // request.userId = decrypt.sub;
    // request.userRole = decrypt.role;

    const role = this.reflector.get(Role, context.getHandler());
    if (!role) {
      return true;
    }
    const isAllowed = request.user.role === role;
    if (!isAllowed) {
      throw new UnauthorizedException(`Endpoint restricted to ${role}s`);
    }
    // request.token = token[1];
    return true;
  }
}
