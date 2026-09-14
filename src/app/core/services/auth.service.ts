import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
  User as FirebaseUser,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

/**
 * Infrastructure gateway around Firebase Auth. Holds no state and makes no
 * lifecycle decisions: SessionStore consumes `authState$` and orchestrates.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  // Built here so the stream is created inside an injection context, even
  // though subscribers attach later.
  public readonly authState$: Observable<FirebaseUser | null> = authState(
    this.auth,
  );

  public signInWithGoogle(): Promise<UserCredential> {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  public signOut(): Promise<void> {
    return signOut(this.auth);
  }
}
