import { RolesGuard } from '../roles.guard';
import { Reflector } from '@nestjs/core';
import { RbacService } from '../rbac.service';

describe('RolesGuard', () => {
  it('allows when user has required role', async () => {
    const reflector: any = { getAllAndOverride: jest.fn().mockReturnValue(['Receptionist']) };
    const rbac = new RbacService();
    const guard = new RolesGuard(reflector as any, rbac);
    const ctx: any = { switchToHttp: () => ({ getRequest: () => ({ user: { roles: ['Receptionist'] } }) }), getHandler: () => {}, getClass: () => {} };
    expect(await guard.canActivate(ctx as any)).toBeTruthy();
  });

  it('denies when user lacks required role', async () => {
    const reflector: any = { getAllAndOverride: jest.fn().mockReturnValue(['Admin']) };
    const rbac = new RbacService();
    const guard = new RolesGuard(reflector as any, rbac);
    const ctx: any = { switchToHttp: () => ({ getRequest: () => ({ user: { roles: ['Receptionist'] } }) }), getHandler: () => {}, getClass: () => {} };
    expect(await guard.canActivate(ctx as any)).toBeFalsy();
  });
});
