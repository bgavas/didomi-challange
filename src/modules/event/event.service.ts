import { Service } from 'typedi';
import { User } from '../../db/entities/user.entity';
import { ConsentService } from '../consent/consent.service';
import { UserService } from '../user/user.service';
import { CreateConsentEventDto } from './dto/create-consent-event.dto';

@Service()
export class EventService {
  constructor(
    private userService: UserService,
    private consentService: ConsentService,
  ) {}

  async createConsentEvent({
    userId,
    consents,
  }: CreateConsentEventDto): Promise<User> {
    // Get user by id. This function return 404 if user not found
    const user = await this.userService.getUserById(userId);

    // Update consents
    await this.consentService.updateUserConsents(user, consents);

    // Refetch user and return
    return this.userService.getUserById(userId);
  }
}
