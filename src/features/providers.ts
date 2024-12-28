import { Provider } from '@nestjs/common';
import { UsersRepository } from './users/repositories/user.repository';
import { EUserProviderKeys } from './users/enums/user-providers.enum';
import { UserService } from './users/services/user.service';
import { EUrlProviderKeys } from './urls/enums/url-providers.enum';
import { UrlsRepository } from './urls/repositories/url.repository';
import { UrlService } from './urls/services/url.service';
export const usersProviders: Provider[] = [
  {
    provide: EUserProviderKeys.USER_REPOSITORY,
    useClass: UsersRepository,
  },
  {
    provide: EUserProviderKeys.USER_SERVICE,
    useClass: UserService,
  },
  {
    provide: EUrlProviderKeys.URL_REPOSITORY,
    useClass: UrlsRepository,
  },
  {
    provide: EUrlProviderKeys.URL_SERVICE,
    useClass: UrlService,
  },
];
