import { computed, inject, Injectable } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { FirestoreHelperService } from '../../../../core/services/firebase/firestore-helper.service';
import { BabyEventCategory } from '../../../../models/baby.model';

@Injectable({
  providedIn: 'root',
})
export class BabyEventsPreferencesService {
  private firestoreHelper = inject(FirestoreHelperService);
  private userService = inject(UserService);
  private usersCollection = this.userService.usersCollection;
  private userUid = this.userService.user().uid;

  public readonly preferences = computed(
    () => this.userService.user().babyEventsPreferences
  );

  public async updatePreferences(preferences: BabyEventCategory[]) {
    try {
      await this.firestoreHelper.update(this.usersCollection, this.userUid, {
        babyEventsPreferences: preferences,
      });
      console.log('Preferences updated successfully:', preferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }
}
