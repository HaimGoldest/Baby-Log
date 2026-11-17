/**
 * Hard cap on the length of a note, shared by event notes and the favorite
 * notes that seed them.
 *
 * The value is layout-driven rather than a storage constraint, and raising it
 * needs both of these checked:
 * - The event card clamps a note to two lines in its fixed slot. At 80, on a
 *   360px phone, a note of ordinary words shows in full; only an unbroken run
 *   of wide letters is cut short, with an ellipsis.
 * - Favorite notes also render as menu item labels in the events panel's
 *   long-press menu, where 80 characters wrap to two or three lines.
 *
 * Counted in UTF-16 code units, matching the native `maxlength` attribute and
 * `Validators.maxLength`, so an emoji costs two.
 */
export const BABY_NOTE_MAX_LENGTH = 80;
