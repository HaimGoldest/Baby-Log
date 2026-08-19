import { computed, inject, Injectable } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { BabyEventCategory } from '../../../models/baby.model';
import { User } from '../../../models/user.model';
import { FireStoreHelperService } from '../../../core/firebase/fire-store-helper.service';

@Injectable({
  providedIn: 'root',
})
export class BabyEventPreferencesService {
  private firestoreHelper = inject(FireStoreHelperService);
  private userService = inject(UserService);
  private usersCollection = this.userService.usersCollection;

  // Reactive: this service is provided in root and may be constructed before
  // the user is authenticated, so the uid cannot be snapshotted here.
  private readonly userUid = computed(() => this.userService.user()?.uid);

  public readonly preferences = computed(
    () => this.userService.user()?.babyEventsPreferences
  );

  public async updatePreferences(
    preferences: BabyEventCategory[]
  ): Promise<void> {
    try {
      const userUid = this.userUid();
      if (!userUid) {
        throw new Error('No user is signed in, cannot save preferences.');
      }

      await this.firestoreHelper.update<User>(this.usersCollection, userUid, {
        babyEventsPreferences: preferences,
      });
      console.log('Preferences updated successfully:', preferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }
}
