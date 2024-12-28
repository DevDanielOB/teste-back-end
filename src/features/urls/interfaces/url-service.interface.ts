export interface IUrlService {
  generateShortUrl(originalUrl: string): Promise<string>;
  getOriginalUrl(shortUrl: string): Promise<string>;
}
