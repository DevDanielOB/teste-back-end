/* eslint-disable @typescript-eslint/no-require-imports */
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { EUserProviderKeys } from '../enums/user-providers.enum';
import { IUsersRepository } from '../interfaces/user-repository.interface';
import { UserRequestDto } from '../dtos/user-request.dto';
import { User } from '../models/user.entity';
const bcrypt = require('bcryptjs');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<IUsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: EUserProviderKeys.USER_REPOSITORY,
          useValue: {
            getUserByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(EUserProviderKeys.USER_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpa os mocks após cada teste
  });

  describe('maintainUser', () => {
    it('should create a new user if email is not taken', async () => {
      const mockRequest: UserRequestDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const mockUser: User = {
        id: 1,
        userName: 'John Doe',
        userEmail: 'john.doe@example.com',
        creationTimestamp: new Date(),
      } as any;

      userRepository.getUserByEmail.mockResolvedValue(undefined);
      userRepository.createUser.mockResolvedValue(mockUser);

      const result = await userService.maintainUser(mockRequest);

      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        mockRequest.email,
      );
      expect(userRepository.createUser).toHaveBeenCalledWith({
        passwordHash: expect.any(String),
        userEmail: 'john.doe@example.com',
        userName: 'John Doe',
      });
      expect(result).toEqual(expect.objectContaining({ userName: 'John Doe' }));
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('should throw ConflictException if email is already taken', async () => {
      const mockRequest: UserRequestDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const existingUser: User = {
        id: 1,
        userName: 'John Doe',
        userEmail: 'john.doe@example.com',
        passwordHash: 'hashedPassword123',
        creationTimestamp: new Date(),
      } as any;

      userRepository.getUserByEmail.mockResolvedValue(existingUser);

      await expect(userService.maintainUser(mockRequest)).rejects.toThrow(
        ConflictException,
      );
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        mockRequest.email,
      );
      expect(userRepository.createUser).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for other errors', async () => {
      const mockRequest: UserRequestDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      userRepository.getUserByEmail.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(userService.maintainUser(mockRequest)).rejects.toThrow(
        BadRequestException,
      );
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        mockRequest.email,
      );
      expect(userRepository.createUser).not.toHaveBeenCalled();
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user if found', async () => {
      const mockEmail = 'john.doe@example.com';
      const mockUser: User = {
        id: 1,
        userName: 'John Doe',
        userEmail: mockEmail,
        passwordHash: 'hashedPassword123',
        creationTimestamp: new Date(),
      } as any;

      userRepository.getUserByEmail.mockResolvedValue(mockUser);

      const result = await userService.getUserByEmail(mockEmail);

      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(mockEmail);
      expect(result).toEqual(mockUser);
    });

    it('should return undefined if no user is found', async () => {
      const mockEmail = 'notfound@example.com';

      userRepository.getUserByEmail.mockResolvedValue(undefined);

      const result = await userService.getUserByEmail(mockEmail);

      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(mockEmail);
      expect(result).toBeUndefined();
    });
  });

  describe('comparePasswords', () => {
    it('should return true if passwords match', async () => {
      const enteredPassword = 'password123';
      const hashedPassword = 'hashedPassword123';

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await userService.comparePasswords(
        enteredPassword,
        hashedPassword,
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        enteredPassword,
        hashedPassword,
      );

      expect(result).toBe(true);

      jest.restoreAllMocks();
    });

    it('should return false if passwords do not match', async () => {
      const enteredPassword = 'password123';
      const hashedPassword = 'hashedPassword123';

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await userService.comparePasswords(
        enteredPassword,
        hashedPassword,
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        enteredPassword,
        hashedPassword,
      );

      expect(result).toBe(false);

      jest.restoreAllMocks();
    });
  });
});
