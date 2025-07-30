import { IRepository } from 'src/shared/database/interfaces/repository.interface';
import { Url } from '../models/url.entity';

export interface IUrlRepository extends IRepository {
  shortenUrl(originalUrl: Partial<Url>): Promise<Url>;
  findUrlByShortUrl(shortUrl: string): Promise<Url | undefined>;
  findUrlByOriginalUrl(
    originalUrl: string,
    userId: number,
  ): Promise<Url | undefined>;
  updateUrlWithClickCount(shortUrl: string): Promise<void>;
  deleteUrl(filters: Partial<Url>): Promise<void>;
  findUrlsByUserId(userId: number): Promise<Url[]>;
  updateOriginalUrl(shortUrl: string, newOriginalUrl: string): Promise<void>;
}
