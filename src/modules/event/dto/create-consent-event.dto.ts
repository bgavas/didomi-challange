import { IsArray, IsString } from 'class-validator';
import { Consent } from '../../consent/interfaces/consent.interface';

export class CreateConsentEventDto {
  @IsString()
  userId: string;

  @IsArray()
  consents: Consent[];
}
