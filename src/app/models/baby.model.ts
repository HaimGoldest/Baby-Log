import { Gender } from '../enums/gender.enum';

export interface Baby {
  uid: string;
  name: string;
  gender: Gender;
  birthDate: Date;
  eventsData: BabyEvent[];
  measurementsData: BabyMeasurement[];
  imageUrl?: string;
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
  createdBy: string;
  lastEditedBy?: string;
}

export interface BabyEventCategory {
  id: string;
  defaultComment: string;
  imagePath: string;
  isCategoryEnabled: boolean;
  isDefaultCommentEnabled: boolean;
}
