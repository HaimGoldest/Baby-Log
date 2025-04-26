import { Injectable, inject, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  authState,
  signOut,
  User as FirebaseUser,
} from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private userService = inject(UserService);
  private router = inject(Router);
  private authData = toSignal(authState(this.auth), { initialValue: null });

  public readonly isLoggedIn = computed(() => !!this.userService.user());

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
      console.log('User manually signed out');
    } catch (err) {
      console.error('Error manually signing out:', err);
    }
  }

  private async handleAuthChange(firebaseUser: FirebaseUser | null) {
    if (firebaseUser) {
      await this.userService.initUser(firebaseUser);
    } else {
      this.userService.dispose();
      console.log('Logged out: moving to login page.');
      this.router.navigate(['/login']);
    }
  }
}
