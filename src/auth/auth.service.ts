import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import bcrypt from "bcrypt";
import { LoginDTo } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserEventsService } from 'src/events/user-events.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly userRegisterEventService:UserEventsService
    ) {
    }


    private async hashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }

    private async verifyPassword(plainPassword: string, hashPassword: string) {
        return bcrypt.compare(plainPassword, hashPassword);
    }

    private generateAccesstoken(user: User) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role
        }
        return this.jwtService.sign(payload, {
            secret: "jwt_secret",
            expiresIn: "15m",
        })
    }

    private generateRefreshToken(user: User) {
        const payload = {
            sub: user.id,
        }

        return this.jwtService.sign(payload, {
            secret: "refresh_secret",
            expiresIn: "15m",
        })

    }



    private generateTokens(user: User) {

        return {
            accessToken: this.generateAccesstoken(user),
            refreshToken: this.generateRefreshToken(user)
        }
    }


    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, { secret: "refresh_secret" });
            const user = await this.userRepository.findOne({
                where: {
                    id: payload.sub
                }
            })
            if (!user) {
                throw new UnauthorizedException("Invalid Token");
            }

            return this.generateAccesstoken(user);
        }
        catch (error) {
            throw new UnauthorizedException("Invalid Token");
        }
    }

    async registerUser(registerDto: RegisterDto) {
        const existingUser = await this.userRepository.findOne({
            where: {
                email: registerDto.email
            }
        })

        if (existingUser) {
            throw new ConflictException("This email is already in user");
        }

        const hashedPassword = await this.hashPassword(registerDto.password);

        const user = this.userRepository.create({
            email: registerDto.email,
            name: registerDto.name,
            password: hashedPassword,
            role: UserRole.USER
        })
        const savedUser = await this.userRepository.save(user);
        const { password, ...result } = savedUser;
        this.userRegisterEventService.emitUserRegistered(user);
        return {
            result,
            message: "Registration Successful"
        }
    }

    async registerAdmin(registerDto: RegisterDto) {
        const existingAdmin = await this.userRepository.findOne({
            where: {
                email: registerDto.email
            }
        })

        if (existingAdmin) {
            throw new ConflictException("Admin With this email already exists");
        }

        const hashedPassword = await this.hashPassword(registerDto.password);
        const admin = this.userRepository.create({
            email: registerDto.email,
            password: hashedPassword,
            role: UserRole.ADMIN
        })

        return this.userRepository.save(admin);
    }


    async login(loginDto: LoginDTo) {
        const user = await this.userRepository.findOne({
            where: {
                email: loginDto.email
            }
        })

        if (!user || !(await this.verifyPassword(loginDto.password, user.password))) {
            throw new UnauthorizedException("Invalid Credentials");
        }

        const { password, ...result } = user;
        return {
            message: "Logged In Successfully",
            result,
            tokens: this.generateTokens(user)
        }
    }

    async getUserById(id: number) {
        const user = await this.userRepository.findOne({
            where: {
                id
            }
        })

        if (!user) {
            throw new UnauthorizedException("User Not Found");
        }

        const { password, ...result } = user;
        return result;
    }
}
