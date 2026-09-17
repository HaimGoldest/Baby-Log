/**
 * Hard cap on the length of a note, shared by event notes and the favorite
 * notes that seed them.
 *
 * The value is layout-driven rather than a storage constraint: the event card
 * is a fixed 150px tall, and favorite notes additionally render as menu item
 * labels in the events panel's long-press menu. Raising it needs both checked.
 *
 * Counted in UTF-16 code units, matching the native `maxlength` attribute and
 * `Validators.maxLength`, so an emoji costs two.
 */
export const BABY_NOTE_MAX_LENGTH = 62;
