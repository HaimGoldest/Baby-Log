import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BabyEventPreferencesService } from '../services/baby-event-preferences.service';
import { BabyEventsPreferencesItemComponent } from '../components/baby-events-preferences-item/baby-event-preferences-item.component';
import { AppRoute } from '../../../enums/app-route.enum';
import BabyEventsPreferencesStrings from './baby-event-preferences.strings';
import { NotificationService } from '../../../core/services/notification.service';
import NotificationStrings from '../../../shared/strings/notification.strings';

@Component({
  selector: 'app-baby-event-preferences',
  templateUrl: './baby-event-preferences.page.html',
  styleUrls: ['./baby-event-preferences.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [BabyEventsPreferencesItemComponent],
})
export class BabyEventsPreferencesPage {
  private preferencesService = inject(BabyEventPreferencesService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  public babyEventsCategories = this.preferencesService.preferences;
  public hasChanged = false;
  public strings = BabyEventsPreferencesStrings;

  public onChanged(): void {
    this.hasChanged = true;
  }

  public async save(): Promise<void> {
    if (!this.hasChanged) return;

    try {
      await this.preferencesService.updatePreferences(
        this.babyEventsCategories()
      );
      this.hasChanged = false;
      this.navigateEventsPage();
    } catch (error) {
      this.notificationService.error(
        NotificationStrings.SAVE_PREFERENCES_FAILED
      );
    }
  }

  public cancel(): void {
    this.navigateEventsPage();
  }

  private navigateEventsPage() {
    this.router.navigate(['/', AppRoute.BabyEvents]);
  }
}
