import { Controller, Post, Body, UseGuards, Get, Patch, Req, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    // Validate and return JWT
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) throw new Error('Invalid credentials');
    return this.authService.login(user as any);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: any) {
    return this.authService.findById(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.sub, dto as any);
  }

  // Logout - for stateless JWT, you should revoke the token server-side (e.g., store in Redis blacklist)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any) {
    // Example: invalidate req.headers.authorization token in a Redis blacklist (not implemented)
    return { success: true };
  }

  // Password reset: request token and confirm
  @Post('password-reset/request')
  async requestPasswordReset(@Body() body: { email: string }) {
    return this.authService.requestPasswordReset(body.email);
  }

  @Post('password-reset/confirm')
  async confirmPasswordReset(@Body() body: { token: string; newPassword: string }) {
    return this.authService.confirmPasswordReset(body.token, body.newPassword);
  }

  // --- Admin routes ---
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Post('admin/users/:id/roles')
  async setRoles(@Param('id') id: string, @Body() body: { roles: string[] }) {
    return this.authService.changeUserRoles(id, body.roles);
  }
}
