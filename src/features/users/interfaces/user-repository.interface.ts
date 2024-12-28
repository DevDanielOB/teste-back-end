import { IRepository } from 'src/infra/database/interfaces/repository.interface';
import { User } from '../models/user.entity';

export interface IUsersRepository extends IRepository {
  createUser(user: User): Promise<User>;
  getUserById(id: number): Promise<User | undefined>;
  updateUser(id: string, user: Partial<User>);
  getUserByEmail(email: string): Promise<User | undefined>;
}
