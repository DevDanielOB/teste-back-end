import { IsString, IsEmail, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRequestDto {
  @ApiProperty({
    description: 'Name of the user',
    example: 'Daniel Oliveira',
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required.' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters.' })
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'daniel.oliveira@email.com',
  })
  @IsString()
  @IsEmail({}, { message: 'Invalid email format.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: '123456789',
  })
  @IsString()
  @MaxLength(9, { message: 'Password cannot exceed 9 characters.' })
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}
