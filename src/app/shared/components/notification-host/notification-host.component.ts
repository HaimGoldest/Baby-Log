import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AlertMessageComponent } from '../alert-message/alert-message.component';
import { NotificationService } from '../../../core/services/notification.service';

/**
 * Renders the current notification stack once, globally.
 * Mounted a single time in `AppComponent`; nothing else should render alerts
 * for transient feedback.
 */
@Component({
  selector: 'app-notification-host',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlertMessageComponent],
  templateUrl: './notification-host.component.html',
  styleUrl: './notification-host.component.scss',
})
export class NotificationHostComponent {
  private notificationService = inject(NotificationService);

  public readonly notifications = this.notificationService.notifications;

  public dismiss(id: number): void {
    this.notificationService.dismiss(id);
  }
}
