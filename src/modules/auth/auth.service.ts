import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Repository } from 'typeorm';
import { LoginDto, RefreshTokenDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    // private userService: UserService,
    private jwtService: JwtService,
    private configServices: ConfigService,
  ) {}

  // async validateUser(username: string, pass: string): Promise<any> {
  //   const user = await this.userService.findOneByUsername(username);
  //   if (user && user.password === pass) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }

  // async login(user: any) {
  //   const payload = { username: user.username, sub: user.userId };
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //   };
  // }
  async signIn(loginDto: LoginDto) {
    const { password, username } = loginDto;
    const user: any = await this.userRepository.findOne({
      where: { username },
    });
    if (_.isEmpty(user)) {
      throw new HttpException(
        'Tài khoản không tồn tại!',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const { password: passwordOfUser } = user;
    const checkPassword: boolean = _.isEqual(passwordOfUser, password);
    if (!checkPassword) {
      throw new HttpException(
        'Tài khoản hoặc mật khẩu không đúng!',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return await this.generateToken(user);
  }

  async refreshToken(RefreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = RefreshTokenDto ?? {};
    try {
      const verify = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.SECRET,
      });
      const checkExistToken = await this.userRepository.findOne({
        where: { username: verify?.username, refreshToken },
      });
      if (checkExistToken) {
        return this.generateToken(checkExistToken);
      } else {
        throw new HttpException(
          'Refresh token is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      throw new HttpException(
        'Refresh token is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async generateToken(user: User) {
    const payload = { id: user.userCode, username: user.username };
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.SECRET,
      expiresIn: process.env.EXP_IN_REFRESH_TOKEN,
    });
    user.refreshToken = refresh_token;
    await this.userRepository.save(user);
    return {
      access_token,
      refresh_token,
    };
  }
}
// async signIn(LoginDto: LoginDto): Promise<{
//   access_token: string;
//   username: string;
//   firstName: string;
//   lastName: string;
//   permission: string;
// }> {
//   const { username, password } = LoginDto;
//   const user = await this.userService.findOneByUsername(username);
//   if (user?.password !== password) {
//     throw new UnauthorizedException();
//   }
//   const payload = { sub: user.id, username: user.username };
//   return {
//     access_token: await this.jwtService.signAsync(payload),
//     username: user?.username,
//     firstName: user?.firstName,
//     lastName: user?.lastName,
//     permission: user?.permissionCode,
//   };
// }
