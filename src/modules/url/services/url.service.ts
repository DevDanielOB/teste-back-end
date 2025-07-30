import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EUrlProviderKeys } from '../enums/url-providers.enum';
import { IUrlService } from '../interfaces/url-service.interface';
import { IUrlRepository } from '../interfaces/url-repository.interface';
import { UrlValidator } from 'src/shared/utils/url-validator';
import { env } from 'src/shared/environment';
import { Url } from '../models/url.entity';
import { UrlDecode } from 'src/shared/utils/url-decode';
import { AuthService } from 'src/auth/auth.service';

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

    userData = accessToken ? this.decodeAndValidateToken(accessToken) : null;
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
    const urlRecord = await this.validateAndFetchUrlByShortUrl(shortUrl);

    await this.urlRepository.updateUrlWithClickCount(shortUrl);

    return urlRecord.originalUrl;
  }

  async getUrlsByUserId(accessToken: string): Promise<Url[]> {
    let userData = null;

    userData = this.decodeAndValidateToken(accessToken);

    const data = await this.urlRepository.findUrlsByUserId(userData.id);

    return data.map((url) => ({
      ...url,
      shortUrl: `${env.base_url}/${url.shortUrl}`,
    }));
  }

  async deleteUrl(filters: Partial<Url>, accessToken?: string): Promise<void> {
    let userData = null;

    userData = this.decodeAndValidateToken(accessToken);

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

  async updateOriginalUrl(
    shortUrl: string,
    newOriginalUrl: string,
    accessToken?: string,
  ): Promise<void> {
    let userData = null;
    if (!UrlValidator.isValidUrl(newOriginalUrl)) {
      throw new BadRequestException('Invalid URL');
    }

    userData = accessToken ? this.decodeAndValidateToken(accessToken) : null;

    const urlRecord = await this.validateAndFetchUrlByShortUrl(shortUrl);

    if (urlRecord.userId !== userData.id) {
      throw new UnauthorizedException('You do not own this URL');
    }

    await this.urlRepository.updateOriginalUrl(
      UrlDecode.extractShortUrl(shortUrl),
      newOriginalUrl,
    );
  }

  private decodeAndValidateToken(accessToken?: string): { id: string } {
    const userData = this.authService.decodeToken(accessToken);
    if (!userData?.id) {
      throw new UnauthorizedException('Invalid access token');
    }
    return userData;
  }

  private async validateAndFetchUrlByShortUrl(shortUrl: string): Promise<Url> {
    const decodedShortUrl = UrlDecode.extractShortUrl(shortUrl);
    const urlRecord =
      await this.urlRepository.findUrlByShortUrl(decodedShortUrl);
    if (!urlRecord) {
      throw new NotFoundException('Short URL not found');
    }
    return urlRecord;
  }
}
