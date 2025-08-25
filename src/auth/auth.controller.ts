import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDTo } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { CurrenUser } from './decorators/currentuser.decorator';
import { Roles } from './decorators/roles.decorators';
import { UserRole } from './entities/user.entity';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.registerUser(registerDto);
    }

    @Post('login')
    login(@Body() loginDto: LoginDTo) {
        return this.authService.login(loginDto);
    }

    @Post('refresh')
    refreshToken(@Body('refreshToken') refreshToken: string) {
        return this.refreshToken(refreshToken);
    }

    @UseGuards(JwtAuthGuard)
    @Get("profile")
    getProfile(@CurrenUser() user: any) {
        return user;
    }

    @Post('create-admin')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    createAdmin(@Body() registerDto: RegisterDto) {
        return this.authService.registerAdmin(registerDto);
    }
}
