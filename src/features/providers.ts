import { Provider } from '@nestjs/common';
import { UsersRepository } from './users/repositories/user.repository';
import { EUserProviderKeys } from './users/enums/user-providers.enum';
import { UserService } from './users/services/user.service';
export const usersProviders: Provider[] = [
  {
    provide: EUserProviderKeys.USER_REPOSITORY,
    useClass: UsersRepository,
  },
  {
    provide: EUserProviderKeys.USER_SERVICE,
    useClass: UserService,
  },
];
