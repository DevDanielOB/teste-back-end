import { IRepository } from 'src/infra/database/interfaces/repository.interface';
import { Url } from '../models/url.entity';

export interface IUrlRepository extends IRepository {
  shortenUrl(originalUrl: Partial<Url>): Promise<Url>;
  findUrlByShortUrl(shortUrl: string): Promise<Url | undefined>;
}
