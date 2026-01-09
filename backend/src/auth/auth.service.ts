import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { EventBusService } from './event-bus.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
    private jwtService: JwtService,
    private eventBus: EventBusService,
  ) {}

  /** Validate user credentials and return user without password */
  async validateUser(email: string, pass: string) {
    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.email = :email', { email })
      .leftJoinAndSelect('u.roles', 'roles')
      .getOne();

    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (!match) return null;
    // remove password for downstream
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safe } = user as any;
    return safe as User;
  }

  async login(user: User) {
    const payload = { sub: user.id, roles: user.roles?.map((r) => r.name) || [] };
    const token = this.jwtService.sign(payload);
    // Emit UserLoggedIn event
    await this.eventBus.publish('UserLoggedIn', { userId: user.id, at: new Date().toISOString() });
    return { accessToken: token };
  }

  async register(adminUser: Partial<User>) {
    // Admin-only flow would create users, assign roles
    const passwordHash = await bcrypt.hash(adminUser.password || Math.random().toString(36), 12);
    const user = this.usersRepo.create({
      email: adminUser.email,
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      password: passwordHash,
      roles: adminUser.roles,
    });
    return this.usersRepo.save(user);
  }

  async findById(id: string) {
    return this.usersRepo.findOne({ where: { id }, relations: ['roles'] });
  }

  async requestPasswordReset(email: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    // Production: create token, store hashed token in DB or Redis with TTL, and send to email
    const token = Math.random().toString(36).slice(2);
    // For demo: just return token
    return { token };
  }

  async confirmPasswordReset(token: string, newPassword: string) {
    // Production: verify token from DB/Redis
    throw new Error('Not implemented - integrate your token storage and verification');
  }

  async updateProfile(id: string, payload: Partial<User>) {
    await this.usersRepo.update(id, payload);
    return this.findById(id);
  }

  async changeUserRoles(userId: string, roleNames: string[]) {
    const user = await this.usersRepo.findOne({ where: { id: userId }, relations: ['roles'] });
    if (!user) throw new NotFoundException('User not found');
    const roles = await this.rolesRepo.find({ where: { name: In(roleNames) } });
    user.roles = roles;
    const saved = await this.usersRepo.save(user);
    await this.eventBus.publish('UserRoleChanged', { userId: saved.id, roles: roleNames });
    return saved;
  }
}
