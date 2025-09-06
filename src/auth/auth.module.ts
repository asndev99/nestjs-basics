import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { LoginThrottleGuard } from './guards/login-throttle.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule, JwtModule.register({}), ThrottlerModule.forRoot(), EventsModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, LoginThrottleGuard],
  exports: [AuthService]
})
export class AuthModule { }
