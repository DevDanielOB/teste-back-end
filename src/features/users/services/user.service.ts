/* eslint-disable @typescript-eslint/no-require-imports */
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UserRequestDto } from '../dtos/user-request.dto';
import { EUserProviderKeys } from '../enums/user-providers.enum';
import { IUsersRepository } from '../interfaces/user-repository.interface';
import { User } from '../models/user.entity';
import { plainToClass } from 'class-transformer';
const bcrypt = require('bcryptjs');

import { IUserService } from '../interfaces/user-service.interface';

@Injectable()
export class UserService implements IUserService {
  private readonly rounds = 12;

  constructor(
    @Inject(EUserProviderKeys.USER_REPOSITORY)
    private readonly userRepository: IUsersRepository,
  ) {}

  async maintainUser(userRequest: UserRequestDto): Promise<User> {
    try {
      const existingUser = await this.getUserByEmail(userRequest.email);

      if (existingUser) {
        throw new ConflictException(
          `User with email ${userRequest.email} already exists`,
        );
      }

      const hashedPassword = await bcrypt.hash(
        userRequest.password,
        this.rounds,
      );

      const user = plainToClass(User, {
        userName: userRequest.name,
        userEmail: userRequest.email,
        passwordHash: hashedPassword,
      });

      const createdUser = await this.userRepository.createUser(user);

      delete createdUser.passwordHash;
      return createdUser;
    } catch (e) {
      Logger.error('Error creating user', e.stack);

      if (e instanceof ConflictException) {
        throw e;
      }

      throw new BadRequestException(`Error creating user: ${e.message}`);
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.getUserByEmail(email);
  }

  async comparePasswords(
    enteredPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(enteredPassword, hashedPassword);
  }
}
