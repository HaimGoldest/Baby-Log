import { BabyEventCategory } from './baby.model';

export interface User {
  uid: string;
  name: string;
  email: string;
  babyEventsPreferences: BabyEventCategory[];
  babiesUids: string[];
}
