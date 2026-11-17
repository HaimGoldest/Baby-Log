import type { BabyEventCategory } from '../../models/baby.model';
import CategoryColorsStrings from './category-colors.strings';

/**
 * The colours a user can give an event category, in picker order.
 *
 * `default` follows the active theme (its primary container), so categories
 * without a choice blend with whichever theme is on. Every other id needs a
 * row in `$_category-color-palette` in `src/styles.scss`, which emits its
 * `--app-cat-palette-<id>-bg / -fg` tokens for the light themes and for dark.
 *
 * Ids are stored in users' profiles, so an id is never renamed or removed:
 * a colour can be retuned in `styles.scss`, but its id stays.
 */
export const CATEGORY_COLOR_PALETTE = [
  { id: 'default', label: CategoryColorsStrings.DEFAULT },
  { id: 'yellow', label: CategoryColorsStrings.YELLOW },
  { id: 'lemon', label: CategoryColorsStrings.LEMON },
  { id: 'amber', label: CategoryColorsStrings.AMBER },
  { id: 'orange', label: CategoryColorsStrings.ORANGE },
  { id: 'coral', label: CategoryColorsStrings.CORAL },
  { id: 'red', label: CategoryColorsStrings.RED },
  { id: 'rose', label: CategoryColorsStrings.ROSE },
  { id: 'pink', label: CategoryColorsStrings.PINK },
  { id: 'orchid', label: CategoryColorsStrings.ORCHID },
  { id: 'lavender', label: CategoryColorsStrings.LAVENDER },
  { id: 'purple', label: CategoryColorsStrings.PURPLE },
  { id: 'indigo', label: CategoryColorsStrings.INDIGO },
  { id: 'blue', label: CategoryColorsStrings.BLUE },
  { id: 'sky', label: CategoryColorsStrings.SKY },
  { id: 'cyan', label: CategoryColorsStrings.CYAN },
  { id: 'teal', label: CategoryColorsStrings.TEAL },
  { id: 'mint', label: CategoryColorsStrings.MINT },
  { id: 'emerald', label: CategoryColorsStrings.EMERALD },
  { id: 'lime', label: CategoryColorsStrings.LIME },
  { id: 'sand', label: CategoryColorsStrings.SAND },
] as const;

export type CategoryColorId = (typeof CATEGORY_COLOR_PALETTE)[number]['id'];

/** A colour other than the theme default: the only values ever stored. */
export type CustomCategoryColorId = Exclude<CategoryColorId, 'default'>;

/**
 * A user's custom colours, keyed by category id. Sparse: a category on the
 * theme default has no entry at all.
 */
export type CategoryColorMap = Partial<
  Record<BabyEventCategory['id'], CustomCategoryColorId>
>;

export const DEFAULT_CATEGORY_COLOR = 'default' satisfies CategoryColorId;

export function isCustomCategoryColorId(
  value: unknown,
): value is CustomCategoryColorId {
  return (
    value !== DEFAULT_CATEGORY_COLOR &&
    CATEGORY_COLOR_PALETTE.some((color) => color.id === value)
  );
}

/**
 * The colour a category renders in. A stored value this build does not know
 * (most likely written by a newer one) renders as the default.
 */
export function resolveCategoryColor(
  colors: CategoryColorMap,
  categoryId: string,
): CategoryColorId {
  const stored = colors[categoryId];
  return isCustomCategoryColorId(stored) ? stored : DEFAULT_CATEGORY_COLOR;
}

/**
 * Returns a copy of `colors` with the category set to `color`. Choosing the
 * default removes the entry, so only customised categories are ever stored.
 */
export function withCategoryColor(
  colors: CategoryColorMap,
  categoryId: string,
  color: CategoryColorId,
): CategoryColorMap {
  const others = Object.entries(colors).filter(([id]) => id !== categoryId);

  return Object.fromEntries(
    color === DEFAULT_CATEGORY_COLOR ? others : [...others, [categoryId, color]],
  );
}
