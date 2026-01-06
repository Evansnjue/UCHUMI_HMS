import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { RbacService } from './rbac.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private rbac: RbacService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user || !user.roles) return false;
    // Use RBAC service to check if user has one of the required roles
    return this.rbac.hasAnyRole(user.roles, requiredRoles);
  }
}
