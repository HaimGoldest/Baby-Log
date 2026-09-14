export interface User {
  uid: string;
  name: string;
  email: string;
  eventFavorites: BabyEventFavorites[];
  babiesUids: string[];
}

export interface BabyEventFavorites {
  categoryId: string;
  commonComments: string[];
}
