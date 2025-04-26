import { Baby } from '../models/baby.model';

export class BabyFactory {
  public static createBabyObject(baby: Baby): Baby | null {
    if (baby) {
      return {
        uid: baby.uid,
        name: baby.name,
        gender: baby.gender,
        birthDate: baby.birthDate,
        eventsData: baby.eventsData,
        measurementsData: baby.measurementsData,
        usersUids: baby.usersUids,
      };
    }

    return null;
  }
}
