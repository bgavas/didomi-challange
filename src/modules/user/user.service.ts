import { isEmail } from 'class-validator';
import { HttpError, NotFoundError } from 'routing-controllers';
import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';
import { User } from '../../db/entities/user.entity';
import { errors } from '../../utils/errors';
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
      throw new HttpError(422, errors.PROVIDE_A_VALID_URL);
    }

    // Check if there is already a user with the same email
    const duplicateUser = await this.userRepository.getByEmail(dto.email);
    // Throw error if email is not unique
    if (duplicateUser) {
      throw new HttpError(422, errors.USER_WITH_THIS_EMAIL_EXISTS);
    }

    // Create user
    return this.userRepository.createUser(dto);
  }

  async getUserById(id: string): Promise<User> {
    // Get user by id
    const user = await this.userRepository.getById(id);

    // Throw error if user not found
    if (!user) {
      throw new NotFoundError(errors.USER_NOT_FOUND);
    }

    return user;
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.getUsers();
  }

  async deleteUserById(id: string): Promise<User> {
    // Get user by id
    const user = await this.userRepository.getById(id);

    // Throw error if user not found
    if (!user) {
      throw new NotFoundError(errors.USER_NOT_FOUND);
    }

    // Delete user
    return this.userRepository.deleteUser(user);
  }
}
