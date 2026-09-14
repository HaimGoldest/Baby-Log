import { BabyEventCategory } from './baby.model';

export interface User {
  uid: string;
  name: string;
  email: string;
  eventFavorites: BabyEventFavorites[];
  babiesUids: string[];
}

export interface BabyEventFavorites {
  eventId: string;
  commonComments: string[];
  isCategoryEnabled: boolean;
}
