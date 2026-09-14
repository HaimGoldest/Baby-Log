import { Gender } from '../../../enums/gender.enum';
import { Baby } from '../../../models/baby.model';

export type NewBabyData = {
  name: string;
  gender: Gender;
  birthDate: Date;
  imageUrl: string;
};

export interface BabiesState {
  baby: Baby | null;
}

export const initialBabiesState: BabiesState = {
  baby: null,
};
