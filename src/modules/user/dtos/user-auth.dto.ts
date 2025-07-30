import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    description: 'User email',
    type: String,
    example: 'daniel.oliveira@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    type: String,
    example: '123456789',
  })
  password: string;
}
