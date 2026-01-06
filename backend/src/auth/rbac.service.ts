import { Injectable } from '@nestjs/common';

@Injectable()
export class RbacService {
  // For RBAC you may choose a roles->permissions mapping stored in DB. This simple service
  // provides convenience functions to check role intersections. For fine-grained checks use
  // permissions and check `permission in role.permissions`.

  hasAnyRole(userRoles: string[] | any[], requiredRoles: string[]) {
    const names = (userRoles as any[]).map((r) => (typeof r === 'string' ? r : r.name));
    return requiredRoles.some((rr) => names.includes(rr));
  }
}
