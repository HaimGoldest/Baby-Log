import { Injectable } from '@angular/core';
import { Observable, map, startWith } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isLoggedIn$: Observable<boolean>;
  pictureUrl$: Observable<string>;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router
  ) {
    this.angularFireAuth.authState.subscribe((user) =>
      this.firebaseAuthChangeListener(user, this.router)
    );

    this.isLoggedIn$ = angularFireAuth.authState.pipe(map((user) => !!user));
    this.pictureUrl$ = angularFireAuth.authState.pipe(
      map((user) => (user ? user.photoURL : null)),
      startWith(null)
    );
  }

  logout() {
    console.log('logout by button');
    this.angularFireAuth.signOut();
  }

  private firebaseAuthChangeListener(response, router: Router) {
    if (response) {
      console.log('Logged in :)');
      this.router.navigate(['./baby-actions']);
    } else {
      console.log('Logged out :(');
      router.navigate(['./login']);
    }
  }
}
