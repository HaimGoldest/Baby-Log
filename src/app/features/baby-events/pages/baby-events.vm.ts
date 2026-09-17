import { BabyEventCategory } from '../../../models/baby.model';
import { BabyEventFavorites } from '../../../models/user.model';

export interface BabyEventCategoryView {
  category: BabyEventCategory;
  favorite: BabyEventFavorites;
}
