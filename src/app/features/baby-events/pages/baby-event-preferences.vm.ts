import { BabyEventCategory } from '../../../models/baby.model';

/**
 * A single editable comment inside the preferences draft.
 *
 * `id` exists only to key the `@for` loop rendering the comments: tracking by
 * text collides as soon as two comments are equal (two blank rows added in a
 * row), and tracking by index recreates the input on every removal, dropping
 * focus and caret position.
 */
export interface CommentDraft {
  id: number;
  text: string;
}

/**
 * A favorite category as edited on the preferences page. Held locally until
 * the user saves, so nothing here is shared with `SessionStore`'s state.
 */
export interface FavoriteDraft {
  category: BabyEventCategory;
  comments: CommentDraft[];
}
