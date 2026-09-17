import { BabyEventFavorites, User } from '../models/user.model';
import { User as FirebaseUser } from 'firebase/auth';
import BABY_EVENT_CATEGORIES_DATA from '../core/default-data/baby-event-categories-data';

export type UserFactoryResult = {
  user: User;
  needSaving: boolean;
};

export class UserFactory {
  /**
   * Create a full User object from partial user data and Firebase auth data
   */
  public static createUserObject(
    user: Partial<User> | null,
    authData: FirebaseUser,
  ): UserFactoryResult {
    const favorites = this.syncEventFavorites(user?.eventFavorites);

    const finalUser: User = {
      uid: user?.uid ?? authData.uid,
      name: user?.name ?? authData.displayName ?? 'Unknown User',
      email: user?.email ?? authData.email ?? 'Unknown Email',
      eventFavorites: favorites.value,
      babiesUids: user?.babiesUids ?? [],
    };

    return {
      user: finalUser,
      needSaving: this.isMissingSomeBaseProperty(user) || favorites.changed,
    };
  }

  /**
   * Check if the user is missing some base properties
   */
  private static isMissingSomeBaseProperty(user: Partial<User> | null): boolean {
    return !user || !user.uid || !user.name || !user.email || !user.babiesUids;
  }

  /**
   * Favorites are sparse and never seeded: an absent entry means the user
   * removed that category, and an absent or empty list means they have not
   * chosen any yet. Both stay empty, and the preferences page is where the
   * first category gets added.
   *
   * The only reconciliation done here is dropping entries whose category no
   * longer exists in the catalogue.
   */
  private static syncEventFavorites(stored?: BabyEventFavorites[]): {
    value: BabyEventFavorites[];
    changed: boolean;
  } {
    const favorites = stored ?? [];

    const value = favorites.filter((favorite) =>
      BABY_EVENT_CATEGORIES_DATA.some(
        (category) => category.id === favorite.categoryId,
      ),
    );

    return { value, changed: value.length !== favorites.length };
  }
}
