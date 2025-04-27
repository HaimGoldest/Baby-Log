import { UserStatus } from '../enums/user-status.enum';
import { BabyEventCategory } from './baby.model';

export interface User {
  uid: string;
  name: string;
  email: string;
  status: UserStatus;
  dueDate: Date;
  babyEventsPreferences: BabyEventCategory[];
  babiesUids: string[];
}
