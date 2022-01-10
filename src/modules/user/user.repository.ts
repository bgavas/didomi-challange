import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../db/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(dto: CreateUserDto): Promise<User> {
    const user = await this.save(dto);
    return (await this.getById(user.id) as User);
  }

  async getById(id: string): Promise<User | undefined> {
    return this.createQueryBuilder('u')
      .leftJoinAndSelect('u.consents', 'c')
      .where('u.id = :id', { id })
      .getOne();
  }

  async getByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ email });
  }

  async getUsers(): Promise<User[]> {
    return this.createQueryBuilder('u')
      .leftJoinAndSelect('u.consents', 'c')
      .getMany();
  }

  async deleteUser(user: User): Promise<User> {
    const persistentUser = JSON.parse(JSON.stringify(user));
    await user.remove();
    return persistentUser;
  }
}
