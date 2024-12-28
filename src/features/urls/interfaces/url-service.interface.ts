import { Url } from '../models/url.entity';

export interface IUrlService {
  generateShortUrl(originalUrl: string, accessToken?: string): Promise<string>;
  getOriginalUrl(shortUrl: string): Promise<string>;
  getUrlsByUserId(accessToken: string): Promise<Url[]>;
  deleteUrl(filters: Partial<Url>, accessToken?: string): Promise<void>;
}
