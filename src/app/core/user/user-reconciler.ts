import { User as FirebaseUser } from 'firebase/auth';
import { BabyEventFavorites, User } from '../../models/user.model';
import BABY_EVENT_CATEGORIES_DATA from '../default-data/baby-event-categories-data';

export interface ReconciledUser {
  user: User;
  needSaving: boolean;
}

/**
 * Every field the `User` model defines. Anything else on a stored document is
 * obsolete and gets dropped on the next save.
 *
 * `satisfies Record<keyof User, true>` makes this an exhaustive allow-list:
 * adding a field to `User` without listing it here is a compile error, which
 * is what stops a live field from being silently deleted as "unknown".
 */
const KNOWN_USER_KEYS = {
  uid: true,
  name: true,
  email: true,
  eventFavorites: true,
  babiesUids: true,
} satisfies Record<keyof User, true>;

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
    needSaving:
      isMissingSomeBaseProperty(stored) ||
      favorites.changed ||
      hasObsoleteFields(stored),
  };
}

/**
 * Check if the user is missing some base properties
 */
function isMissingSomeBaseProperty(user: Partial<User> | null): boolean {
  return !user || !user.uid || !user.name || !user.email || !user.babiesUids;
}

/**
 * True when the stored document carries a field the `User` model no longer
 * defines, such as the pre-rename `babyEventsPreferences`.
 *
 * Reporting it through `needSaving` is all the cleanup that is required: the
 * caller persists with `UserService.save`, which is a full-document `setDoc`
 * with no merge, so every field absent from the reconciled object is removed.
 * No explicit `deleteField()` and no per-field migration list is involved, and
 * a future renamed field is cleaned the same way without new code.
 */
function hasObsoleteFields(user: Partial<User> | null): boolean {
  if (!user) return false;

  return Object.keys(user).some((key) => !Object.hasOwn(KNOWN_USER_KEYS, key));
}

/**
 * Favorites are sparse and never seeded: an absent entry means the user
 * removed that category, and an absent or empty list means they have not
 * chosen any yet. Both resolve to `[]`, which `appGuard` turns into a redirect
 * to the preferences page so the user picks categories again.
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
