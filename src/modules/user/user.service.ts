import { isEmail } from 'class-validator';
import { HttpError, NotFoundError } from 'routing-controllers';
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

  async getUserById(id: string): Promise<User> {
    // Get user by id
    const user = await this.userRepository.getById(id);

    // Throw error if user not found
    if (!user) {
      throw new NotFoundError('No user is found with this id');
    }

    return user;
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.getUsers();
  }
}
