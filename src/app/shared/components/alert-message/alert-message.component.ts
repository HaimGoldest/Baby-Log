import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

/**
 * A tonal status card. Inline it sits flat; a container can raise it by setting
 * `--alert-elevation` (a box-shadow) on this element, as the notification host
 * does for toasts.
 */
@Component({
  selector: 'app-alert-message',
  standalone: true,
  imports: [NgClass, MatCardModule],
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss'],
})
export class AlertMessageComponent {
  // Typed explicitly: `input('info')` alone would widen to `string`.
  public readonly type = input<AlertType>('info');
  public readonly title = input('');
  public readonly message = input('');
}
