import { UserRequestDto } from '../dtos/user-request.dto';
import { User } from '../models/user.entity';

export interface IUserService {
  maintainUser(userRequest: UserRequestDto): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
}
