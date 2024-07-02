import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { password, username } = authCredentialsDto;
    // hash

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log({ salt, hashedPassword }, 'salt bcrypt password');

    try {
      const user = await this.userRepository.create({
        username,
        password: hashedPassword,
      });
      await this.userRepository.save(user);
      console.log(user, 'created');

      return 'Sign up successfully';
    } catch (error) {
      console.log(error.code, 'error');
      if (error.code === '23505') {
        // NOTE: duplicate username
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { password, username } = authCredentialsDto;

    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken = await this.jwtService.sign(payload);
      return accessToken;
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async getAllUser(): Promise<UserEntity[]> {
    const query = this.userRepository.createQueryBuilder('user_entity');
    const users = await query.getMany();
    return users;
  }
}
