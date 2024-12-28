import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'Id of the user',
    example: '1',
  })
  id: number;

  @ApiProperty({
    description: 'Name of the user',
    example: 'Daniel Oliveira',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'daniel.oliveira@email.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: '123456789',
  })
  @IsString()
  password: string;
}
