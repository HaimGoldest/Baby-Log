import { Gender } from '../enums/gender.enum';

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
  creationTime: Date;
  lastEditTime: Date;
  comment: string;
}

export interface BabyEventCategory {
  uid: string;
  name: string;
  defaultComment: string;
  imagePath: string;
  isCategoryEnable: boolean;
  isDefaultCommentEnable: boolean;
}
