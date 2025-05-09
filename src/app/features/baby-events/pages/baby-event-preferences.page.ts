import { Component, computed, inject, OnDestroy } from '@angular/core';
import { BabyEventPreferencesService } from '../services/baby-event-preferences.service';
import { BabyEventsPreferencesItemComponent } from '../components/baby-events-preferences-item/baby-event-preferences-item.component';

@Component({
  selector: 'app-baby-event-preferences',
  standalone: true,
  imports: [BabyEventsPreferencesItemComponent],
  templateUrl: './baby-event-preferences.page.html',
  styleUrl: './baby-event-preferences.page.scss',
})
export class BabyEventsPreferencesPage implements OnDestroy {
  private preferencesService = inject(BabyEventPreferencesService);
  private hasChanged = false;

  public babyEventsCategories = computed(() =>
    this.preferencesService.preferences()
  );

  ngOnDestroy(): void {
    if (this.hasChanged) {
      this.preferencesService.updatePreferences(this.babyEventsCategories());
    }
  }

  public onChanged(): void {
    if (!this.hasChanged) {
      this.hasChanged = true;
    }
  }
}
