import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from 'src/infra/auth/auth.service';
import { EUrlProviderKeys } from '../enums/url-providers.enum';
import { IUrlService } from '../interfaces/url-service.interface';
import { UrlRequestDto } from '../dtos/url-request.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/infra/auth/auth.guard';
import {
  UrlListResponseDto,
  UrlShortResponseDto,
} from '../dtos/url-response.dto';

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

  @UseGuards(AuthGuard)
  @Post('shorten')
  @HttpCode(HttpStatus.CREATED)
  @ApiBadRequestResponse({
    description: `
      - Invalid credentials.
      - User not found.
      `,
  })
  @ApiCreatedResponse({
    description: 'http://localhost:3498/emmd71',
    type: UrlShortResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: `
    - Invalid bearer token format
    - Token Bearer is invalid
    `,
  })
  async shortenUrl(@Req() req: any, @Body() body: UrlRequestDto) {
    const accessToken = req.token || null;

    const { originalUrl } = body;
    const shortenedUrl = await this.urlService.generateShortUrl(
      originalUrl,
      accessToken,
    );
    return shortenedUrl;
  }

  @UseGuards(AuthGuard)
  @Get('getAllUrls')
  @ApiOkResponse({
    description: 'Ok',
    type: [UrlListResponseDto],
  })
  @ApiUnauthorizedResponse({
    description: `
    - Invalid bearer token format
    - Token Bearer is invalid
    `,
  })
  @ApiNoContentResponse({
    description: 'No content',
  })
  async getAllUrls(@Req() req: any) {
    const accessToken = req.token || null;
    const urls = await this.urlService.getUrlsByUserId(accessToken);

    if (urls.length === 0) {
      throw new HttpException('', 204);
    }

    return urls;
  }

  @Get(':shortUrl')
  async redirectToOriginal(
    @Param('shortUrl') shortUrl: string,
    @Res() res: Response,
  ) {
    try {
      const originalUrl = await this.urlService.getOriginalUrl(shortUrl);

      return res.redirect(originalUrl);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ message: 'Short URL not found' });
      }
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Patch('deleteUrl')
  @ApiOkResponse({
    description: 'Ok',
  })
  @ApiUnauthorizedResponse({
    description: `
    - Invalid bearer token format
    - Token Bearer is invalid
    `,
  })
  @ApiBadRequestResponse({
    description: `
    - URL not found
    `,
  })
  async deleteUrl(@Req() req: any, @Body() body: UrlRequestDto) {
    const accessToken = req.token || null;
    const { originalUrl } = body;
    await this.urlService.deleteUrl({ originalUrl }, accessToken);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('updateOrigin/:shortUrl')
  @ApiOkResponse({
    description: 'Ok',
  })
  @ApiUnauthorizedResponse({
    description: `
    - Invalid bearer token format
    - Token Bearer is invalid
    - You do not own this URL
    `,
  })
  @ApiBadRequestResponse({
    description: `
    - URL not found
    `,
  })
  @ApiParam({
    name: 'shortUrl',
    description: 'The short URL identifier',
    example: 'http://localhost/aZbKq7',
  })
  async updateOriginalUrl(
    @Param('shortUrl') shortUrl: string,
    @Body() body: UrlRequestDto,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<void> {
    const accessToken = req.token;
    await this.urlService.updateOriginalUrl(
      shortUrl,
      body.originalUrl,
      accessToken,
    );

    res.json({ originalUrl: body.originalUrl });
  }
}
