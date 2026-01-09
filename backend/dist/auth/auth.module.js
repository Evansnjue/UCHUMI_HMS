var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { JwtStrategy } from './jwt.strategy';
import { RbacService } from './rbac.service';
import { EventBusService } from './event-bus.service';
import { UserEventsSubscriber } from './subscribers/user-events.subscriber';
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    Module({
        imports: [
            TypeOrmModule.forFeature([User, Role, Permission]),
            JwtModule.register({
                secret: process.env.JWT_SECRET || 'replace-me',
                signOptions: { expiresIn: '1h' },
            }),
        ],
        controllers: [AuthController],
        providers: [AuthService, JwtStrategy, RbacService, EventBusService, UserEventsSubscriber],
        exports: [AuthService, RbacService, EventBusService],
    })
], AuthModule);
export { AuthModule };
//# sourceMappingURL=auth.module.js.map