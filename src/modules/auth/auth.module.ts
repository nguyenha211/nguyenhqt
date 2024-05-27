import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
// import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    // UserModule,
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    JwtModule.register({
      global: true,
      secret: '123456',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // LocalStrategy
  ],
  exports: [AuthService],
})
export class AuthModule {}
