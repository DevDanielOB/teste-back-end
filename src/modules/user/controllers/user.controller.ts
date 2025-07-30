import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { EUserProviderKeys } from '../enums/user-providers.enum';
import { IUsersRepository } from '../interfaces/user-repository.interface';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IUserService } from '../interfaces/user-service.interface';
import { UserRequestDto } from '../dtos/user-request.dto';
import { User } from '../models/user.entity';
import { UserResponseDto } from '../dtos/user-response.dto';
import { AuthDto } from '../dtos/user-auth.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
@ApiBearerAuth()
@ApiTags('User Module')
export class UserController {
  constructor(
    @Inject(EUserProviderKeys.USER_SERVICE)
    private readonly userService: IUserService,
    @Inject(EUserProviderKeys.USER_REPOSITORY)
    private readonly userRepository: IUsersRepository,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBadRequestResponse({
    description: `
    - Error creating user: Error.
    - Name cannot exceed 100 characters.
    - Name is required.
    - Password cannot exceed 9 characters.
    - Password is required.
    - Email is required.
    - Invalid email format.
    `,
  })
  @ApiConflictResponse({
    description: '- Email already exists, please choose another one.',
  })
  @ApiCreatedResponse({
    description: 'User created successfully.',
    type: UserResponseDto,
  })
  async create(@Body() body: UserRequestDto): Promise<User> {
    return await this.userService.maintainUser(body);
  }

  @Post('auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiBadRequestResponse({
    description: `
    - Invalid credentials.
    - User not found.
    `,
  })
  @ApiCreatedResponse({
    description:
      '"access_token": "eyJhbTciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhbmllbC5vbGl2ZWIyYUBlbWFpbC5jb20iLCJzdWIiOiIxIiwiaWF0IjoxNzM1MzQ1NzM3LCJleHAiOjE3MzUzNDkzMzd9.ny-ZJr0wMw-c7LpRPjjaSPleZ2bS6XCbNd9uY2OtWug"',
    type: String,
  })
  async auth(@Body() body: AuthDto) {
    const { email, password } = body;
    return this.authService.auth(email, password);
  }
}
