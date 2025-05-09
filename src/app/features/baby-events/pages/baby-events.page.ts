import { Component, computed, inject, signal } from '@angular/core';
import { BabyEventsPanelComponent } from '../components/baby-events-panel/baby-events-panel.component';
import { BabyEventCategory } from '../../../models/baby.model';
import { BabyEventsService } from '../services/baby-events.service';
import { BabyEventCardComponent } from '../components/baby-event-card/baby-event-card.component';

@Component({
  selector: 'app-baby-events',
  standalone: true,
  imports: [BabyEventsPanelComponent, BabyEventCardComponent],
  templateUrl: './baby-events.page.html',
  styleUrl: './baby-events.page.scss',
})
export class BabyEventsComponent {
  private readonly babyEventsService = inject(BabyEventsService);
  private currentFilteredCategory = signal<BabyEventCategory | null>(null);

  private readonly allEvents = computed(() => this.babyEventsService.events());
  private readonly filteredEvents = computed(() =>
    this.allEvents().filter(
      (event) => event.category === this.currentFilteredCategory()
    )
  );

  public filterMode = computed(() => this.currentFilteredCategory() !== null);
  public readonly displayedEvents = computed(() =>
    this.filterMode() ? this.filteredEvents() : this.allEvents()
  );

  onFilter(category: BabyEventCategory) {
    this.currentFilteredCategory.set(category);
  }

  onUnfilter() {
    this.currentFilteredCategory.set(null);
  }

  //   public addEvent(): void {}
  //   public deleteEvent(): void {}
  //   public updateEvent(): void {}
}
