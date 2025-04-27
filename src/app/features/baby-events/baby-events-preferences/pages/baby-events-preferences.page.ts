import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { BabyEventsPreferencesService } from '../services/baby-events-preferences.service';

@Component({
  selector: 'app-baby-events-preferences',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './baby-events-preferences.page.html',
  styleUrl: './baby-events-preferences.page.scss',
})
export class BabyEventsPreferencesPage {
  private preferencesService = inject(BabyEventsPreferencesService);
  private hasChanged = false;

  public babyEventsCategories = computed(() => {
    this.preferencesService.preferences();
  });

  public onChanged(): void {
    if (!this.hasChanged) {
      this.hasChanged = true;
    }
  }
}
