import { Service } from 'typedi';
import { getConnection, getManager } from 'typeorm';
import { v4 } from 'uuid';
import { User } from '../../src/db/entities/user.entity';

@Service()
export class Seed {
  users: User[];

  constructor() {
    this.users = [
      User.create({
        id: v4(),
        email: 'john@gmail.com',
      }),
      User.create({
        id: v4(),
        email: 'may@gmail.com',
      }),
    ];
  }

  async populateTables() {
    await User.insert(this.users);
  }

  async clearTables() {
    const connection = getConnection();
    await connection.getRepository(User).delete({});
  }
}
