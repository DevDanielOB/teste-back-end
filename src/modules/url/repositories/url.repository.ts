import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Url } from '../models/url.entity';
import { IUrlRepository } from '../interfaces/url-repository.interface';
import { BaseRepository } from 'src/shared/database/database.repository';

@Injectable()
export class UrlsRepository
  extends BaseRepository<Url>
  implements IUrlRepository
{
  constructor(dataSource: DataSource) {
    super(Url, dataSource);
  }

  async shortenUrl(originalUrl: Partial<Url>): Promise<Url> {
    return await this.save({ ...originalUrl });
  }

  async findUrlByShortUrl(shortUrl: string): Promise<Url | undefined> {
    return await this.findOne({ where: { shortUrl } });
  }

  async findUrlByOriginalUrl(
    originalUrl: string,
    userId?: number,
  ): Promise<Url | undefined> {
    return await this.findOne({ where: { originalUrl, userId } });
  }

  async updateUrlWithClickCount(shortUrl: string): Promise<void> {
    await this.update({ shortUrl }, { clickCount: () => 'clickCount + 1' });
  }

  async findUrlsByUserId(userId: number): Promise<Url[]> {
    return await this.find({
      where: {
        userId,
        deletedAt: null,
      },
    });
  }

  async deleteUrl(filters: Partial<Url>): Promise<void> {
    await this.update(filters, { deletedAt: new Date() });
  }

  async updateOriginalUrl(
    shortUrl: string,
    newOriginalUrl: string,
  ): Promise<void> {
    await this.createQueryBuilder()
      .update(Url)
      .set({ originalUrl: newOriginalUrl })
      .where('shortUrl = :shortUrl', { shortUrl })
      .execute();
  }
}
