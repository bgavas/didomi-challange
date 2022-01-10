import { Body, JsonController, Post } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { User } from '../../db/entities/user.entity';
import { CreateConsentEventDto } from './dto/create-consent-event.dto';
import { EventService } from './event.service';

@JsonController('/events')
@Service()
@OpenAPI({})
export class EventController {
  constructor(
    private eventService: EventService,
  ) {}

  @Post('/consents')
  async createEvent(
    @Body() dto: CreateConsentEventDto,
  ): Promise<User> {
    return this.eventService.createConsentEvent(dto);
  }
}
