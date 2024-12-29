export class UrlDecode {
  static extractShortUrl(fullUrl: string): string {
    const parts = fullUrl.split('/');
    return parts[parts.length - 1];
  }
}
