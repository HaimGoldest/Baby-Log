import { Component, OnDestroy, OnInit } from '@angular/core';
import * as firebaseui from 'firebaseui';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  ui: firebaseui.auth.AuthUI;
  errorMsg: string = null;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.afAuth.app.then((app) => {
      const uiConfig = {
        signInOptions: [GoogleAuthProvider.PROVIDER_ID],
        callbacks: {
          signInSuccessWithAuthResult: this.onLoginSuccessful.bind(this),
        },
      };

      this.ui = new firebaseui.auth.AuthUI(app.auth());
      this.ui.start('#firebaseui-auth-container', uiConfig);
    });
  }

  ngOnDestroy() {
    this.ui.delete();
  }

  onLoginSuccessful(result) {
    console.log('onLoginSuccessful');
    if (result.error) {
      console.error('Firebase UI error:', result.error);
      // Handle error based on error code (e.g., display an error message to the user)
    } else {
      console.log('Firebase UI result:', result);
    }
  }
}
