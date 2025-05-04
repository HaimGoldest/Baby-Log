import { Gender } from '../enums/gender.enum';
import { User } from './user.model';

export interface Baby {
  uid: string;
  name: string;
  gender: Gender;
  birthDate: Date;
  eventsData: BabyEvent[];
  measurementsData: BabyMeasurement[];
  usersUids: string[];
}

export interface BabyMeasurement {
  uid: string;
  date: Date;
  height: number;
  weight: number;
  headMeasure: number;
}

export interface BabyEvent {
  uid: string;
  category: BabyEventCategory;
  comment: string;
  time: Date;
  createdBy: User;
  lastEditedBy?: User;
}

export interface BabyEventCategory {
  name: string;
  defaultComment: string;
  imagePath: string;
  isCategoryEnabled: boolean;
  isDefaultCommentEnabled: boolean;
}
