import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { User as FirebaseUser } from 'firebase/auth';
import {
  Subscription,
  firstValueFrom,
  from,
  Observable,
  throwError,
} from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { UserFactory } from '../../factories/user.factory';
import { BabiesService } from './babies.service';
import { Gender } from '../../enums/gender.enum';
import { Baby } from '../../models/baby.model';
import { Router } from '@angular/router';
import { AppRoute } from '../../enums/app-route.enum';
import { FireStoreHelperService } from '../firebase/fire-store-helper.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestoreHelper = inject(FireStoreHelperService);
  private babiesService = inject(BabiesService);
  private router = inject(Router);

  public usersCollection = 'users';

  private _user = signal<User | null>(null);
  public user: Signal<User | null> = this._user.asReadonly();

  private _userPictureUrl = signal<string | null>(null);
  public readonly userPictureUrl = this._userPictureUrl.asReadonly();

  public userHaveBabies = computed(() => this.user()?.babiesUids.length > 0);

  private userSubscription: Subscription | null = null;

  public async initUser(firebaseUser: FirebaseUser): Promise<void> {
    this.stopListeningToUserChanges();

    const existing = await firstValueFrom(
      this.firestoreHelper.get<User>(this.usersCollection, firebaseUser.uid)
    );
    const UserFactoryResult = UserFactory.createUserObject(
      existing,
      firebaseUser
    );
    this._user.set(UserFactoryResult.user);
    this.startListeningToUserChanges(firebaseUser.uid);
    this._userPictureUrl.set(firebaseUser.photoURL ?? null);

    if (UserFactoryResult.needSaving) {
      await firstValueFrom(this.createUserInDatabase());
    }
    if (this.userHaveBabies()) {
      await this.babiesService.setBaby(UserFactoryResult.user.babiesUids[0]);
    }
  }

  public async deleteBabyFromUser(baby: Baby): Promise<void> {
    try {
      const user = this._user();
      if (!user) return;
      await this.babiesService.deleteBaby(user.uid, baby);
      await firstValueFrom(this.removeBabyIdFromUser(this._user(), baby.uid));
    } catch (error) {
      console.error('Failed to delete baby from user:', error);
    }
  }

  public async addNewBaby(babyData: {
    name: string;
    gender: Gender;
    birthDate: Date;
    haveImageInStorage: boolean;
  }): Promise<void> {
    const user = this._user();
    if (!user) {
      console.error('No user data available to add a new baby.');
      return;
    }

    try {
      const newBabyUid = this.firestoreHelper.generateUid();
      await firstValueFrom(this.addBabyIdToUser(user, newBabyUid));
      await this.babiesService.createNewBaby(user.uid, {
        ...babyData,
        uid: newBabyUid,
      });
      console.log(`Baby was added to user:`, this.babiesService.baby());
      this.navigateAfterAddingBaby();
    } catch (error) {
      console.error('Failed to add new baby to user:', error);
    }
  }

  public async addExistingBaby(babyUid: string): Promise<void> {
    try {
      const baby = await this.babiesService.setBaby(babyUid);
      if (!baby) {
        console.error('No baby found with the given UID:', babyUid);
      }
      await firstValueFrom(this.addBabyIdToUser(this._user(), babyUid));
      console.log('Existing baby was added to the user:', baby);
      this.navigateAfterAddingBaby();
    } catch (error) {
      console.error('Failed to add existing baby:', error);
      throw error;
    }
  }

  public dispose(): void {
    this.stopListeningToUserChanges();
    this._user.set(null);
    this._userPictureUrl.set(null);
    this.babiesService.dispose();
  }

  private createUserInDatabase(): Observable<void> {
    const user = this._user();
    if (!user) {
      console.error('No user data to save');
      return from(Promise.resolve());
    }
    console.log('Creating user in DB:', user);
    return this.firestoreHelper
      .set<User>(this.usersCollection, user.uid, user)
      .pipe(
        tap(() => console.log('User created in DB:', user)),
        catchError((err) => {
          console.error('Failed to create user in DB:', err);
          return throwError(() => err);
        })
      );
  }

  private addBabyIdToUser(user: User, newBabyUid: string) {
    return this.firestoreHelper
      .update<User>(this.usersCollection, user.uid, {
        babiesUids: [...(user.babiesUids ?? []), newBabyUid],
      })
      .pipe(
        tap(() =>
          console.log(`Added babyId ${newBabyUid} to user ${user.uid}`)
        ),
        catchError((err) => {
          console.error(
            `Failed to add babyId ${newBabyUid} to user ${user.uid}`,
            err
          );
          return throwError(() => err);
        })
      );
  }

  private removeBabyIdFromUser(user: User, babyUid: string) {
    const updatedBabiesUids = user.babiesUids.filter((uid) => uid !== babyUid);
    return this.firestoreHelper
      .update<User>(this.usersCollection, user.uid, {
        babiesUids: updatedBabiesUids,
      })
      .pipe(
        tap(() =>
          console.log(`Removed babyId ${babyUid} from user ${user.uid}`)
        ),
        catchError((err) => {
          console.error(
            `Failed to remove babyId ${babyUid} from user ${user.uid}`,
            err
          );
          return throwError(() => err);
        })
      );
  }

  private startListeningToUserChanges(userUid: string) {
    this.userSubscription = this.firestoreHelper
      .watch<User>(this.usersCollection, userUid)
      .subscribe({
        next: (data) => {
          if (data) {
            this._user.set(data);
          }
        },
        error: (err) => console.error('Real-time listener error:', err),
      });
  }

  private stopListeningToUserChanges() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
      this.userSubscription = null;
    }
  }

  private navigateAfterAddingBaby() {
    this.router.navigate(['/', AppRoute.BabyEventPreferences]);
  }
}
