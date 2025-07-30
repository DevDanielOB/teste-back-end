import { Provider } from '@nestjs/common';
import { EUrlProviderKeys } from 'src/modules/url/enums/url-providers.enum';
import { UrlsRepository } from 'src/modules/url/repositories/url.repository';
import { UrlService } from 'src/modules/url/services/url.service';
import { EUserProviderKeys } from 'src/modules/user/enums/user-providers.enum';
import { UsersRepository } from 'src/modules/user/repositories/user.repository';
import { UserService } from 'src/modules/user/services/user.service';
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
