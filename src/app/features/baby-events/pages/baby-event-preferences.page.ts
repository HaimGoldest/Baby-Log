import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BabyEventPreferencesService } from '../services/baby-event-preferences.service';
import { BabyEventsPreferencesItemComponent } from '../components/baby-events-preferences-item/baby-event-preferences-item.component';
import { AppRoute } from '../../../enums/app-route.enum';

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

  public babyEventsCategories = this.preferencesService.preferences;
  public hasChanged = false;

  public onChanged(): void {
    this.hasChanged = true;
  }

  public save(): void {
    if (this.hasChanged) {
      this.preferencesService.updatePreferences(this.babyEventsCategories());
      this.hasChanged = false;
      this.navigateEventsPage();
    }
  }

  public cancel(): void {
    this.navigateEventsPage();
  }

  private navigateEventsPage() {
    this.router.navigate(['/', AppRoute.BabyEvents]);
  }
}
