import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDTo } from './dto/login.dto';

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
}
