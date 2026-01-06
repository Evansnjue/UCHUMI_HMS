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

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'replace-me',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RbacService, EventBusService],
  exports: [AuthService, RbacService, EventBusService],
})
export class AuthModule {}
