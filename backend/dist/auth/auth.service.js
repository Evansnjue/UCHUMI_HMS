var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { EventBusService } from './event-bus.service';
let AuthService = class AuthService {
    constructor(usersRepo, rolesRepo, jwtService, eventBus) {
        this.usersRepo = usersRepo;
        this.rolesRepo = rolesRepo;
        this.jwtService = jwtService;
        this.eventBus = eventBus;
    }
    /** Validate user credentials and return user without password */
    async validateUser(email, pass) {
        const user = await this.usersRepo
            .createQueryBuilder('u')
            .addSelect('u.password')
            .where('u.email = :email', { email })
            .leftJoinAndSelect('u.roles', 'roles')
            .getOne();
        if (!user)
            return null;
        const match = await bcrypt.compare(pass, user.password);
        if (!match)
            return null;
        // remove password for downstream
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...safe } = user;
        return safe;
    }
    async login(user) {
        const payload = { sub: user.id, roles: user.roles?.map((r) => r.name) || [] };
        const token = this.jwtService.sign(payload);
        // Emit UserLoggedIn event
        await this.eventBus.publish('UserLoggedIn', { userId: user.id, at: new Date().toISOString() });
        return { accessToken: token };
    }
    async register(adminUser) {
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
    async findById(id) {
        return this.usersRepo.findOne({ where: { id }, relations: ['roles'] });
    }
    async requestPasswordReset(email) {
        const user = await this.usersRepo.findOne({ where: { email } });
        if (!user)
            throw new NotFoundException('User not found');
        // Production: create token, store hashed token in DB or Redis with TTL, and send to email
        const token = Math.random().toString(36).slice(2);
        // For demo: just return token
        return { token };
    }
    async confirmPasswordReset(token, newPassword) {
        // Production: verify token from DB/Redis
        throw new Error('Not implemented - integrate your token storage and verification');
    }
    async updateProfile(id, payload) {
        await this.usersRepo.update(id, payload);
        return this.findById(id);
    }
    async changeUserRoles(userId, roleNames) {
        const user = await this.usersRepo.findOne({ where: { id: userId }, relations: ['roles'] });
        if (!user)
            throw new NotFoundException('User not found');
        const roles = await this.rolesRepo.find({ where: { name: In(roleNames) } });
        user.roles = roles;
        const saved = await this.usersRepo.save(user);
        await this.eventBus.publish('UserRoleChanged', { userId: saved.id, roles: roleNames });
        return saved;
    }
};
AuthService = __decorate([
    Injectable(),
    __param(0, InjectRepository(User)),
    __param(1, InjectRepository(Role)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        JwtService,
        EventBusService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map