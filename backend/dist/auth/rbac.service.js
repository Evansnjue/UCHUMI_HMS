var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let RbacService = class RbacService {
    // For RBAC you may choose a roles->permissions mapping stored in DB. This simple service
    // provides convenience functions to check role intersections. For fine-grained checks use
    // permissions and check `permission in role.permissions`.
    hasAnyRole(userRoles, requiredRoles) {
        const names = userRoles.map((r) => (typeof r === 'string' ? r : r.name));
        return requiredRoles.some((rr) => names.includes(rr));
    }
};
RbacService = __decorate([
    Injectable()
], RbacService);
export { RbacService };
//# sourceMappingURL=rbac.service.js.map