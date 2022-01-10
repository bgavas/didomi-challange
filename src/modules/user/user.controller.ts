import { Body, JsonController, Post } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { User } from '../../db/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@JsonController('/users')
@Service()
@OpenAPI({})
export class UserController {
  constructor(
    private userService: UserService,
  ) {}

  @Post('/')
  async createUser(
    @Body() dto: CreateUserDto,
  ): Promise<User> {
    return this.userService.createUser(dto);
  }
}
