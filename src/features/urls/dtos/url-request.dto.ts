import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UrlRequestDto {
  @ApiProperty({
    description: 'Original Url to shorten',
    example:
      'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
  })
  @IsString()
  @IsNotEmpty({ message: 'Url is required.' })
  originalUrl: string;
}
