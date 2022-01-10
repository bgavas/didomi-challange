import { isEmail } from 'class-validator';
import { HttpError } from 'routing-controllers';
import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';
import { User } from '../../db/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

@Service()
export class UserService {
  private userRepository = getCustomRepository(UserRepository);

  async createUser(dto: CreateUserDto): Promise<User> {
    // Check if email is valid
    const isEmailValid = isEmail(dto.email);

    // Throw error if email is not unique
    if (!isEmailValid) {
      throw new HttpError(422, 'Please provide a valid email');
    }

    // Check if there is already a user with the same email
    const duplicateUser = await this.getUserByEmail(dto.email);
    // Throw error if email is not unique
    if (duplicateUser) {
      throw new HttpError(422, 'A user with this email already exists');
    }

    // Create user
    return this.userRepository.createUser(dto);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.getByEmail(email);
  }
}
