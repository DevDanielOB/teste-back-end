import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/infra/database/database.repository';
import { User } from '../models/user.entity';
import { IUsersRepository } from '../interfaces/user-repository.interface';

@Injectable()
export class UsersRepository
  extends BaseRepository<User>
  implements IUsersRepository
{
  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }

  async createUser(user: User): Promise<User> {
    return await this.save(user);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.findOne({ where: { userEmail: email } });
  }
}
