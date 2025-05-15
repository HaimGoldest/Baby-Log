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
import { AppRoute } from '../../enums/app-route.enum';
import { AppService } from './app.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private appService = inject(AppService);
  private auth = inject(Auth);
  private userService = inject(UserService);
  private router = inject(Router);
  private authData = toSignal<FirebaseUser | null | undefined>(
    authState(this.auth),
    {
      initialValue: undefined,
    }
  );

  public readonly isLoggedIn = computed(() => !!this.userService.user());

  constructor() {
    effect(() => {
      const user = this.authData();
      if (user === undefined) return;

      this.handleAuthChange(user);
    });
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
    this.appService.isLoading.set(false);
    console.log('Auth state changed, Firebase User:', firebaseUser);
    if (firebaseUser) {
      await this.userService.initUser(firebaseUser);
      this.navigateAuthUser();
    } else {
      this.userService.dispose();
      console.log('Logged out: moving to login page.');
      this.router.navigate(['/', AppRoute.Login]);
    }
  }

  private navigateAuthUser(): void {
    const haveBabies = this.userService?.userHaveBabies();

    if (haveBabies) {
      this.router.navigate(['/', AppRoute.HomePage]);
    } else {
      this.router.navigate(['/', AppRoute.AddBaby]);
    }
  }
}
