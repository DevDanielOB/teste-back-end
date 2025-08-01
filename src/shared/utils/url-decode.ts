export class UrlDecode {
  static extractShortUrl(url: string): string {
  const parsed = url.trim().replace(/^https?:\/\/[^/]+\/?/, '');
  return parsed.split('/')[0];
}
}
