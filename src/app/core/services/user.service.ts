import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { FireStoreHelperService } from '../firebase/fire-store-helper.service';

/**
 * CRUD gateway for the `users` collection. Holds no state and makes no
 * lifecycle decisions: SessionStore owns both.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  private firestoreHelper = inject(FireStoreHelperService);

  public readonly usersCollection = 'users';

  public get(uid: string): Promise<User | null> {
    return this.firestoreHelper.get<User>(this.usersCollection, uid);
  }

  /** Full-document overwrite, so fields no longer part of `User` are dropped. */
  public save(user: User): Promise<void> {
    return this.firestoreHelper.set<User>(this.usersCollection, user.uid, user);
  }

  public update(uid: string, changes: Partial<User>): Promise<void> {
    return this.firestoreHelper.update<User>(this.usersCollection, uid, changes);
  }

  public watch(uid: string): Observable<User | null> {
    return this.firestoreHelper.watch<User>(this.usersCollection, uid);
  }
}
