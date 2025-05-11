import * as firebaseui from 'firebaseui';
import { GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirebaseUIAuth } from '../../core/services/firebase/firebase-ui-init';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  ui: firebaseui.auth.AuthUI;

  ngOnInit() {
    const auth = getFirebaseUIAuth();

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

    this.ui = new firebaseui.auth.AuthUI(auth);
    this.ui.start('#firebaseui-auth-container', uiConfig);
  }

  ngOnDestroy() {
    this.ui.delete();
  }

  onLoginSuccessful(result: any) {
    if (result.error) {
      console.error('Login failed with error:', result.error);
    } else {
      console.log('Login successful:', result);
    }
  }
}
