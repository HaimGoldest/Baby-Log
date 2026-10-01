import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

@Component({
  selector: 'app-alert-message',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss'],
})
export class AlertMessageComponent {
  // Typed explicitly: `input('info')` alone would widen to `string`.
  public readonly type = input<AlertType>('info');
  public readonly title = input('');
  public readonly message = input('');
}
