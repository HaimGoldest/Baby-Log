import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';
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
  private authService = inject(AuthService);

  public strings = LoginStrings;
  public loginError = this.authService.loginError;

  signInWithGoogle(): void {
    this.authService.signInWithGoogle();
  }
}
