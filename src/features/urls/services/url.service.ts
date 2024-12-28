import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EUrlProviderKeys } from '../enums/url-providers.enum';
import { IUrlService } from '../interfaces/url-service.interface';
import { IUrlRepository } from '../interfaces/url-repository.interface';
import { UrlValidator } from 'src/infra/core/utils/url-validator';
import { env } from 'src/infra/core/environment';

@Injectable()
export class UrlService implements IUrlService {
  constructor(
    @Inject(EUrlProviderKeys.URL_REPOSITORY)
    private readonly urlRepository: IUrlRepository,
  ) {}

  async generateShortUrl(originalUrl: string): Promise<string> {
    if (!UrlValidator.isValidUrl(originalUrl)) {
      throw new Error('Invalid URL');
    }

    const shortUrl = Math.random().toString(36).substring(2, 8);

    await this.urlRepository.shortenUrl({
      originalUrl,
      shortUrl,
    });

    return `${env.base_url}/${shortUrl}`;
  }

  async getOriginalUrl(shortUrl: string): Promise<string> {
    const url = await this.urlRepository.findUrlByShortUrl(shortUrl);

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    return url.originalUrl;
  }
}
