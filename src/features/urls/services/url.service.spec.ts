import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { IUrlRepository } from '../interfaces/url-repository.interface';
import { AuthService } from 'src/infra/auth/auth.service';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UrlValidator } from 'src/infra/core/utils/url-validator';
import { env } from 'src/infra/core/environment';
import { EUrlProviderKeys } from '../enums/url-providers.enum';
import { UrlDecode } from 'src/infra/core/utils/url-decode';

jest.mock('src/infra/core/utils/url-validator');
jest.mock('src/infra/core/environment');
jest.mock('src/infra/auth/auth.service');

describe('UrlService', () => {
  let urlService: UrlService;
  let urlRepository: jest.Mocked<IUrlRepository>;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: EUrlProviderKeys.URL_REPOSITORY,
          useValue: {
            findUrlByOriginalUrl: jest.fn(),
            shortenUrl: jest.fn(),
            findUrlByShortUrl: jest.fn(),
            updateUrlWithClickCount: jest.fn(),
            findUrlsByUserId: jest.fn(),
            deleteUrl: jest.fn(),
            updateOriginalUrl: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            decodeToken: jest.fn(),
          },
        },
      ],
    }).compile();

    urlService = module.get<UrlService>(UrlService);
    urlRepository = module.get(
      EUrlProviderKeys.URL_REPOSITORY,
    ) as jest.Mocked<IUrlRepository>;
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateShortUrl', () => {
    it('should throw error if URL is invalid', async () => {
      const originalUrl = 'invalid-url';
      const accessToken = 'validToken';

      jest.spyOn(UrlValidator, 'isValidUrl').mockReturnValue(false);

      await expect(
        urlService.generateShortUrl(originalUrl, accessToken),
      ).rejects.toThrowError('Invalid URL');
    });

    it('should return short URL if valid URL is provided', async () => {
      const originalUrl = 'https://teddy.com';

      jest.spyOn(UrlValidator, 'isValidUrl').mockReturnValue(true);

      urlRepository.findUrlByOriginalUrl.mockResolvedValue(null);
      urlRepository.shortenUrl.mockResolvedValue(undefined);

      const result = await urlService.generateShortUrl(originalUrl);

      expect(result).toContain('undefined/');
    });
  });

  describe('getOriginalUrl', () => {
    it('should return original URL if short URL exists', async () => {
      const shortUrl = 'abc123';
      const mockUrlRecord = { originalUrl: 'https://teddy.com' };

      urlRepository.findUrlByShortUrl.mockResolvedValue(mockUrlRecord as any);
      urlRepository.updateUrlWithClickCount.mockResolvedValue(undefined);

      const result = await urlService.getOriginalUrl(shortUrl);

      expect(urlRepository.findUrlByShortUrl).toHaveBeenCalledWith(shortUrl);
      expect(urlRepository.updateUrlWithClickCount).toHaveBeenCalledWith(
        shortUrl,
      );
      expect(result).toEqual('https://teddy.com');
    });

    it('should throw NotFoundException if short URL does not exist', async () => {
      const shortUrl = 'abc123';

      urlRepository.findUrlByShortUrl.mockResolvedValue(null);

      await expect(urlService.getOriginalUrl(shortUrl)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUrlsByUserId', () => {
    it('should return user URLs for valid access token', async () => {
      const accessToken = 'validToken';
      const mockDecodedUser = { email: 'daniel.oliveira@email.com', id: '1' };
      const mockUrls = [
        { shortUrl: 'abc123', originalUrl: 'https://teddy.com' },
      ];

      authService.decodeToken.mockReturnValue(mockDecodedUser);
      urlRepository.findUrlsByUserId.mockResolvedValue(mockUrls as any);

      const result = await urlService.getUrlsByUserId(accessToken);

      expect(authService.decodeToken).toHaveBeenCalledWith(accessToken);
      expect(urlRepository.findUrlsByUserId).toHaveBeenCalledWith(
        mockDecodedUser.id,
      );
      expect(result).toEqual([
        { ...mockUrls[0], shortUrl: `${env.base_url}/abc123` },
      ]);
    });

    it('should throw UnauthorizedException if access token is invalid', async () => {
      const accessToken = 'invalidToken';

      authService.decodeToken.mockReturnValue(null);

      await expect(urlService.getUrlsByUserId(accessToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('deleteUrl', () => {
    it('should delete the URL if it exists and belongs to the user', async () => {
      const accessToken = 'validToken';
      const mockDecodedUser = { email: 'daniel.oliveira@email.com', id: '1' };
      const mockUrl = {
        originalUrl: 'https://teddy.com',
        userId: '1',
        deletedAt: null,
      };

      authService.decodeToken.mockReturnValue(mockDecodedUser);
      urlRepository.findUrlByOriginalUrl.mockResolvedValue(mockUrl as any);

      await urlService.deleteUrl(
        { originalUrl: 'https://teddy.com' },
        accessToken,
      );

      expect(urlRepository.findUrlByOriginalUrl).toHaveBeenCalledWith(
        'https://teddy.com',
        mockDecodedUser.id,
      );
      expect(urlRepository.deleteUrl).toHaveBeenCalledWith({
        originalUrl: 'https://teddy.com',
        userId: '1',
      });
    });

    it('should throw NotFoundException if URL does not exist', async () => {
      const accessToken = 'validToken';
      const mockDecodedUser = { email: 'daniel.oliveira@email.com', id: '1' };

      authService.decodeToken.mockReturnValue(mockDecodedUser);
      urlRepository.findUrlByOriginalUrl.mockResolvedValue(null);

      await expect(
        urlService.deleteUrl({ originalUrl: 'https://teddy.com' }, accessToken),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if access token is invalid', async () => {
      const accessToken = 'invalidToken';
      const mockDecodedUser = null;

      authService.decodeToken.mockReturnValue(mockDecodedUser);

      await expect(
        urlService.deleteUrl({ originalUrl: 'https://teddy.com' }, accessToken),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updateUrl', () => {
    it('should update the original URL for a valid short URL and authorized user', async () => {
      const shortUrl = 'abc123';
      const newOriginalUrl = 'https://teddy.com';
      const accessToken = 'validToken';
      const userData = { id: 1 };

      jest.spyOn(authService, 'decodeToken').mockReturnValue(userData as any);
      jest.spyOn(urlRepository, 'findUrlByShortUrl').mockResolvedValue({
        shortUrl,
        originalUrl: 'https://teddy.com',
        userId: userData.id,
      } as any);
      jest.spyOn(urlRepository, 'updateOriginalUrl').mockResolvedValue();

      await expect(
        urlService.updateOriginalUrl(shortUrl, newOriginalUrl, accessToken),
      ).resolves.not.toThrow();

      expect(urlRepository.updateOriginalUrl).toHaveBeenCalledWith(
        shortUrl,
        newOriginalUrl,
      );
    });

    it('should throw error if user is unauthorized', async () => {
      const shortUrl = 'abc123';
      const newOriginalUrl = 'https://teddy.com';
      const accessToken = 'invalidToken';

      jest.spyOn(authService, 'decodeToken').mockReturnValue(null);

      await expect(
        urlService.updateOriginalUrl(shortUrl, newOriginalUrl, accessToken),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException for an invalid URL', async () => {
      jest.spyOn(UrlValidator, 'isValidUrl').mockReturnValue(false);
      const shortUrl = 'aZbKq7';
      const newOriginalUrl = 'invalid-url';
      const accessToken = 'validToken';

      await expect(
        urlService.updateOriginalUrl(shortUrl, newOriginalUrl, accessToken),
      ).rejects.toThrow(BadRequestException);
      expect(UrlValidator.isValidUrl).toHaveBeenCalledWith(newOriginalUrl);
    });

    it('should throw NotFoundException if short URL is not found', async () => {
      jest.spyOn(UrlValidator, 'isValidUrl').mockReturnValue(true);
      jest.spyOn(UrlDecode, 'extractShortUrl').mockReturnValue('aZbKq7');
      jest.spyOn(urlRepository, 'findUrlByShortUrl').mockResolvedValue(null);

      const shortUrl = 'http://localhost:3498/aZbKq7';
      const newOriginalUrl = 'https://teddy.com';
      const accessToken = 'validToken';

      await expect(
        urlService.updateOriginalUrl(shortUrl, newOriginalUrl, accessToken),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user does not own the URL', async () => {
      jest.spyOn(UrlValidator, 'isValidUrl').mockReturnValue(true);
      jest.spyOn(UrlDecode, 'extractShortUrl').mockReturnValue('aZbKq7');
      jest
        .spyOn(authService, 'decodeToken')
        .mockReturnValue({ email: 'daniel.oliveira@email.com', id: '1' });
      jest.spyOn(urlRepository, 'findUrlByShortUrl').mockResolvedValue({
        userId: 1,
        originalUrl: 'https://teddy.com',
      } as any);

      const shortUrl = 'http://localhost:3498/aZbKq7';
      const newOriginalUrl = 'https://teddy.com';
      const accessToken = 'validToken';

      await expect(
        urlService.updateOriginalUrl(shortUrl, newOriginalUrl, accessToken),
      ).rejects.toThrow(UnauthorizedException);
      expect(urlRepository.findUrlByShortUrl).toHaveBeenCalledWith('aZbKq7');
    });
  });
});
