import { RolesGuard } from '../roles.guard';
import { RbacService } from '../rbac.service';
describe('RolesGuard', () => {
    it('allows when user has required role', async () => {
        const reflector = { getAllAndOverride: jest.fn().mockReturnValue(['Receptionist']) };
        const rbac = new RbacService();
        const guard = new RolesGuard(reflector, rbac);
        const ctx = { switchToHttp: () => ({ getRequest: () => ({ user: { roles: ['Receptionist'] } }) }), getHandler: () => { }, getClass: () => { } };
        expect(await guard.canActivate(ctx)).toBeTruthy();
    });
    it('denies when user lacks required role', async () => {
        const reflector = { getAllAndOverride: jest.fn().mockReturnValue(['Admin']) };
        const rbac = new RbacService();
        const guard = new RolesGuard(reflector, rbac);
        const ctx = { switchToHttp: () => ({ getRequest: () => ({ user: { roles: ['Receptionist'] } }) }), getHandler: () => { }, getClass: () => { } };
        expect(await guard.canActivate(ctx)).toBeFalsy();
    });
});
//# sourceMappingURL=roles.guard.spec.js.map