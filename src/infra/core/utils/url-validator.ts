import * as validator from 'validator';
import { env } from '../environment';

export class UrlValidator {
  static isValidUrl(url: string): boolean {
    return validator.isURL(url);
  }
}
