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
   * Favorites are sparse: an absent entry means the user removed that category,
   * so missing categories are never re-added. An absent or empty list instead
   * means the user was never initialized, and every category is seeded.
   */
  private static syncEventFavorites(stored?: BabyEventFavorites[]): {
    value: BabyEventFavorites[];
    changed: boolean;
  } {
    if (!stored?.length) {
      return { value: this.createDefaultEventFavorites(), changed: true };
    }

    const value = stored.filter((favorite) =>
      BABY_EVENT_CATEGORIES_DATA.some(
        (category) => category.id === favorite.categoryId,
      ),
    );

    return { value, changed: value.length !== stored.length };
  }

  /**
   * Default Baby Event Favorites: every known category, no comments.
   */
  private static createDefaultEventFavorites(): BabyEventFavorites[] {
    return BABY_EVENT_CATEGORIES_DATA.map((category) => ({
      categoryId: category.id,
      commonComments: [],
    }));
  }
}
