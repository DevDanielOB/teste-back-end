import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/infra/database/database.repository';
import { Url } from '../models/url.entity';
import { IUrlRepository } from '../interfaces/url-repository.interface';

@Injectable()
export class UrlsRepository
  extends BaseRepository<Url>
  implements IUrlRepository
{
  constructor(dataSource: DataSource) {
    super(Url, dataSource);
  }

  async shortenUrl(originalUrl: Partial<Url>): Promise<Url> {
    return await this.save(originalUrl);
  }

  async findUrlByShortUrl(shortUrl: string): Promise<Url | undefined> {
    return await this.findOne({ where: { shortUrl } });
  }
}
