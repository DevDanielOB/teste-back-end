import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UrlListResponseDto {
  @ApiProperty({
    description: 'Id of the URL record',
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Original URL provided by the user',
    example:
      'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
  })
  @IsString()
  originalUrl: string;

  @ApiProperty({
    description: 'Shortened URL generated by the system',
    example: 'http://localhost/aZbKq7',
  })
  @IsString()
  shortUrl: string;

  @ApiProperty({
    description: 'Number of times the shortened URL was accessed',
    example: 42,
  })
  @IsNumber()
  clickCount: number;

  @ApiProperty({
    description: 'Date and time the record was created',
    example: '2024-12-27T20:52:37.000Z',
  })
  @IsDate()
  creationDate: Date;

  @ApiProperty({
    description: 'Date and time the record was last updated',
    example: '2024-12-28T10:15:00.000Z',
  })
  @IsDate()
  lastUpdatedDate: Date;

  @ApiProperty({
    description: 'Date and time the record was deleted',
    example: null,
  })
  @IsOptional()
  @IsDate()
  deletionDate: Date | null;
}

export class UrlRecordResponseDto {
  @ApiProperty({
    description: 'Id of the URL record',
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Original URL provided by the user',
    example:
      'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
  })
  @IsString()
  originalUrl: string;

  @ApiProperty({
    description: 'Shortened URL generated by the system',
    example: 'http://localhost/aZbKq7',
  })
  @IsString()
  shortUrl: string;

  @ApiProperty({
    description: 'Date and time the record was created',
    example: '2024-12-27T20:52:37.000Z',
  })
  @IsDate()
  creationDate: Date;
}

export class UrlShortResponseDto {
  @ApiProperty({
    description: 'Shortened URL generated by the system',
    example: 'http://localhost/aZbKq7',
  })
  @IsString()
  shortUrl: string;
}
