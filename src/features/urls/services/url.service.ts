import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EUrlProviderKeys } from '../enums/url-providers.enum';
import { IUrlService } from '../interfaces/url-service.interface';
import { IUrlRepository } from '../interfaces/url-repository.interface';
import { UrlValidator } from 'src/infra/core/utils/url-validator';
import { env } from 'src/infra/core/environment';
import { AuthService } from 'src/infra/auth/auth.service';
import { Url } from '../models/url.entity';

@Injectable()
export class UrlService implements IUrlService {
  constructor(
    @Inject(EUrlProviderKeys.URL_REPOSITORY)
    private readonly urlRepository: IUrlRepository,
    private readonly authService: AuthService,
  ) {}

  async generateShortUrl(
    originalUrl: string,
    accessToken?: string,
  ): Promise<string> {
    let userData = null;
    if (!UrlValidator.isValidUrl(originalUrl)) {
      throw new Error('Invalid URL');
    }

    if (accessToken) {
      userData = this.authService.decodeToken(accessToken);
    }
    const recordExists = await this.urlRepository.findUrlByOriginalUrl(
      originalUrl,
      userData?.id,
    );

    if (recordExists && recordExists.userId === userData?.id) {
      return `${env.base_url}/${recordExists.shortUrl}`;
    }
    const shortUrl = Math.random().toString(36).substring(2, 8);

    await this.urlRepository.shortenUrl({
      originalUrl,
      shortUrl,
      userId: userData?.id || null,
    });

    return `${env.base_url}/${shortUrl}`;
  }

  async getOriginalUrl(shortUrl: string): Promise<string> {
    const url = await this.urlRepository.findUrlByShortUrl(shortUrl);

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    await this.urlRepository.updateUrlWithClickCount(shortUrl);

    return url.originalUrl;
  }

  async getUrlsByUserId(accessToken: string): Promise<Url[]> {
    let userData = null;

    userData = this.authService.decodeToken(accessToken);

    if (!userData?.id) {
      throw new UnauthorizedException('Invalid access token');
    }

    const data = await this.urlRepository.findUrlsByUserId(userData.id);

    return data.map((url) => ({
      ...url,
      shortUrl: `${env.base_url}/${url.shortUrl}`,
    }));
  }

  async deleteUrl(filters: Partial<Url>, accessToken?: string): Promise<void> {
    let userData = null;

    userData = this.authService.decodeToken(accessToken);

    if (!userData?.id) {
      throw new UnauthorizedException('Invalid access token');
    }

    filters.userId = userData.id;
    const url = await this.urlRepository.findUrlByOriginalUrl(
      filters.originalUrl,
      userData.id,
    );

    if (!url || url.deletedAt) {
      throw new NotFoundException('URL not found');
    }
    await this.urlRepository.deleteUrl(filters);
  }
}
