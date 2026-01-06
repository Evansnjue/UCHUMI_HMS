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

  // --- Admin routes ---
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Post('admin/users/:id/roles')
  async setRoles(@Param('id') id: string, @Body() body: { roles: string[] }) {
    return this.authService.changeUserRoles(id, body.roles);
  }
}
