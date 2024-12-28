import * as validator from 'validator';

export class UrlValidator {
  static isValidUrl(url: string): boolean {
    return validator.isURL(url);
  }
}
