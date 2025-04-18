import { Component, OnDestroy, OnInit } from '@angular/core';
import * as firebaseui from 'firebaseui';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FacebookAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  ui: firebaseui.auth.AuthUI;
  errorMsg: string = null;

  constructor(private afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.afAuth.app.then((app) => {
      const uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
          GoogleAuthProvider.PROVIDER_ID,
          FacebookAuthProvider.PROVIDER_ID,
        ],
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
    console.log('Login was successful');
    if (result.error) {
      console.error('Firebase UI error:', result.error);
    } else {
      console.log('Firebase UI result:', result);
    }
  }
}
