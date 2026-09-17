import { User as FirebaseUser } from 'firebase/auth';
import { BabyEventFavorites, User } from '../../models/user.model';
import BABY_EVENT_CATEGORIES_DATA from '../default-data/baby-event-categories-data';

export interface ReconciledUser {
  user: User;
  needSaving: boolean;
}

/**
 * Merges the stored Firestore document with the Firebase auth identity, and
 * reports whether the result differs from what is stored.
 *
 * Pure: it performs no reads or writes, so the caller decides what to persist.
 */
export function reconcileUser(
  stored: Partial<User> | null,
  authData: FirebaseUser,
): ReconciledUser {
  const favorites = syncEventFavorites(stored?.eventFavorites);

  const user: User = {
    uid: stored?.uid ?? authData.uid,
    name: stored?.name ?? authData.displayName ?? 'Unknown User',
    email: stored?.email ?? authData.email ?? 'Unknown Email',
    eventFavorites: favorites.value,
    babiesUids: stored?.babiesUids ?? [],
  };

  return {
    user,
    needSaving: isMissingSomeBaseProperty(stored) || favorites.changed,
  };
}

/**
 * Check if the user is missing some base properties
 */
function isMissingSomeBaseProperty(user: Partial<User> | null): boolean {
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
function syncEventFavorites(stored?: BabyEventFavorites[]): {
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
