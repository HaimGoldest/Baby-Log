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

/**
 * Each measurement is optional and stored as null when not taken, but the
 * form only saves a record that has at least one of them.
 */
export interface BabyMeasurement {
  uid: string;
  date: Date;
  height: number | null;
  weight: number | null;
  headMeasure: number | null;
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
  value: string;
  imagePath: string;
}
