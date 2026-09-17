import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SessionStore } from '../../core/stores/session/session.store';
import LoginStrings from './login.strings';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  private sessionStore = inject(SessionStore);

  public strings = LoginStrings;
  public loginError = this.sessionStore.loginError;

  signInWithGoogle(): void {
    this.sessionStore.signIn();
  }
}
