import { inject, Injectable, signal, Signal } from '@angular/core';
import { User as FirebaseUser } from 'firebase/auth';
import { FirestoreHelperService } from './firebase/firestore-helper.service';
import { User } from '../../models/user.model';
import { UserFactory } from '../../factories/user.factory';
import { BabiesService } from './babies.service';
import { Gender } from '../../enums/gender.enum';
import { Baby } from '../../models/baby.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestoreHelper = inject(FirestoreHelperService);
  private babiesService = inject(BabiesService);

  public usersCollection = 'users';

  private _user = signal<User | null>(null);
  public user: Signal<User | null> = this._user.asReadonly();

  private _userPictureUrl = signal<string | null>(null);
  public readonly userPictureUrl = this._userPictureUrl.asReadonly();

  public async initUser(firebaseUser: FirebaseUser): Promise<void> {
    console.log('Firebase User:', firebaseUser);
    const existing = await this.firestoreHelper.get<User>(
      this.usersCollection,
      firebaseUser.uid
    );
    const isNew = !existing;
    this._user.set(UserFactory.createUserObject(existing, firebaseUser));
    this._userPictureUrl.set(firebaseUser.photoURL ?? null);
    if (isNew) {
      await this.createUserInDatabase();
    }
  }

  public async deleteBabyFromUser(baby: Baby): Promise<void> {
    try {
      await this.babiesService.deleteBaby(this._user().uid, baby);
    } catch (error) {
      console.error('Failed to delete baby from user:', error);
    }
  }

  public async addNewBaby(babyData: {
    name: string;
    gender: Gender;
    birthDate: Date;
  }): Promise<void> {
    const user = this._user();
    if (!user) {
      console.error('No user data available to add a new baby.');
      return;
    }

    try {
      const newBabyUid = this.firestoreHelper.generateUid();
      await this.addBabyIdToUser(user, newBabyUid);
      await this.babiesService.createNewBaby(user.uid, {
        ...babyData,
        uid: newBabyUid,
      });
      console.log('New baby created successfully:', babyData);
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
      this.addBabyIdToUser(this._user(), babyUid);
      console.log('Existing baby was added to the user:', baby);
    } catch (error) {
      console.error('Failed to add existing baby:', error);
      throw error;
    }
  }

  public dispose(): void {
    this._user.set(null);
    this._userPictureUrl.set(null);
    this.babiesService.dispose();
  }

  private async createUserInDatabase(): Promise<void> {
    const user = this._user();
    if (!user) {
      console.error('No user data to save');
      return;
    }
    try {
      await this.firestoreHelper.set<User>(
        this.usersCollection,
        user.uid,
        user
      );
      console.log('User created in DB:', user);
    } catch (err) {
      console.error('Failed to create user in DB:', err);
    }
  }

  private async addBabyIdToUser(user: User, newBabyUid: string) {
    await this.firestoreHelper.update<User>(this.usersCollection, user.uid, {
      babiesUids: [...(user.babiesUids ?? []), newBabyUid],
    });
  }
}
