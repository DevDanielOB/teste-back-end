
import { IRepository } from 'src/shared/database/interfaces/repository.interface';
import { User } from '../models/user.entity';

export interface IUsersRepository extends IRepository {
  createUser(user: User): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
}
