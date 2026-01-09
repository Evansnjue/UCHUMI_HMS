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
import { Controller, Post, Body, UseGuards, Get, Patch, Req, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(dto) {
        // Validate and return JWT
        const user = await this.authService.validateUser(dto.email, dto.password);
        if (!user)
            throw new Error('Invalid credentials');
        return this.authService.login(user);
    }
    async profile(req) {
        return this.authService.findById(req.user.sub);
    }
    async updateProfile(req, dto) {
        return this.authService.updateProfile(req.user.sub, dto);
    }
    // Logout - for stateless JWT, you should revoke the token server-side (e.g., store in Redis blacklist)
    async logout(req) {
        // Example: invalidate req.headers.authorization token in a Redis blacklist (not implemented)
        return { success: true };
    }
    // Password reset: request token and confirm
    async requestPasswordReset(body) {
        return this.authService.requestPasswordReset(body.email);
    }
    async confirmPasswordReset(body) {
        return this.authService.confirmPasswordReset(body.token, body.newPassword);
    }
    // --- Admin routes ---
    async setRoles(id, body) {
        return this.authService.changeUserRoles(id, body.roles);
    }
};
__decorate([
    Post('login'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Get('profile'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "profile", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Patch('profile'),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Post('logout'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    Post('password-reset/request'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestPasswordReset", null);
__decorate([
    Post('password-reset/confirm'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmPasswordReset", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('Admin'),
    Post('admin/users/:id/roles'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "setRoles", null);
AuthController = __decorate([
    Controller('auth'),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map