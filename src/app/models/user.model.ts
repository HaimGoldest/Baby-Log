import { BabyEventCategory } from './baby.model';

export interface User {
  uid: string;
  name: string;
  email: string;
  status: string;
  dueDate: Date;
  babyEventsPref: BabyEventCategory[];
  babiesUids: string[];
}
