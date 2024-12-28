import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from 'src/infra/auth/auth.service';
import { EUrlProviderKeys } from '../enums/url-providers.enum';
import { IUrlService } from '../interfaces/url-service.interface';
import { UrlRequestDto } from '../dtos/url-request.dto';
import { Response } from 'express';

@Controller()
@ApiBearerAuth()
@ApiTags('Urls Module')
export class UrlController {
  constructor(
    @Inject(EUrlProviderKeys.URL_SERVICE)
    private readonly urlService: IUrlService,
    @Inject(EUrlProviderKeys.URL_REPOSITORY)
    private readonly authService: AuthService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBadRequestResponse({
    description: `
      - Invalid credentials.
      - User not found.
      `,
  })
  @ApiCreatedResponse({
    description: 'URL record created successfully.',
    type: String,
  })
  async shortenUrl(@Body() body: UrlRequestDto) {
    const { originalUrl } = body;
    const shortenedUrl = await this.urlService.generateShortUrl(originalUrl);
    return shortenedUrl;
  }

  @Get(':shortUrl')
  async redirectToOriginal(
    @Param('shortUrl') shortUrl: string,
    @Res() res: Response,
  ) {
    try {
      const originalUrl = await this.urlService.getOriginalUrl(shortUrl);
      console.log(originalUrl);

      return res.redirect(originalUrl);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ message: 'Short URL not found' });
      }
      throw error;
    }
  }
}
