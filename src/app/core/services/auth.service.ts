import {
  Injectable,
  inject,
  Signal,
  signal,
  computed,
  effect,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  authState,
  signOut,
  User as FirebaseUser,
} from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { FirestoreHelperService } from './firebase/firestore-helper.service';
import { UserFactory } from '../../factories/user.factory';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);
  public readonly user: Signal<User | null> = this._user.asReadonly();

  public readonly isLoggedIn = computed(() => !!this._user());
  public readonly userPictureUrl = signal<string | null>(null);

  private auth = inject(Auth);
  private router = inject(Router);
  private firestoreHelper = inject(FirestoreHelperService);
  private usersCollection = 'users';

  private authData = toSignal(authState(this.auth), { initialValue: null });

  constructor() {
    effect(
      () => {
        this.handleAuthChange(this.authData());
      },
      { allowSignalWrites: true }
    );
  }

  public async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('User signed out');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  }

  private async handleAuthChange(firebaseUser: FirebaseUser | null) {
    if (firebaseUser) {
      this.userPictureUrl.set(firebaseUser.photoURL ?? null);
      await this.initUser(firebaseUser);
    } else {
      this._user.set(null);
      this.userPictureUrl.set(null);
      console.log('Logged out: moving to login page.');
      this.router.navigate(['/login']);
    }
  }

  private async initUser(firebaseUser: FirebaseUser) {
    console.log('Firebase User:', firebaseUser);
    const existing = await this.firestoreHelper.get<User>(
      this.usersCollection,
      firebaseUser.uid
    );
    const isNew = !existing;
    this._user.set(UserFactory.createUserObject(existing, firebaseUser));
    if (isNew) {
      await this.createUserInDatabase();
    }
  }

  private async createUserInDatabase() {
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
}
