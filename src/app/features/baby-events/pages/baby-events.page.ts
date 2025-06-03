import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { BabyEventsPanelComponent } from '../components/baby-events-panel/baby-events-panel.component';
import { BabyEventCategory } from '../../../models/baby.model';
import { BabyEventsService } from '../services/baby-events.service';
import { BabyEventCardComponent } from '../components/baby-event-card/baby-event-card.component';

@Component({
  selector: 'app-baby-events',
  templateUrl: './baby-events.page.html',
  styleUrl: './baby-events.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [BabyEventsPanelComponent, BabyEventCardComponent],
})
export class BabyEventsComponent {
  private readonly babyEventsService = inject(BabyEventsService);
  private currentFilteredCategory = signal<BabyEventCategory | null>(null);

  private readonly allEvents = this.babyEventsService.events;
  private readonly filteredEvents = computed(() =>
    this.allEvents().filter(
      (event) => event.category.id === this.currentFilteredCategory().id
    )
  );

  public filterMode = computed(() => this.currentFilteredCategory() !== null);

  public readonly displayedEvents = computed(() =>
    this.filterMode() ? this.filteredEvents() : this.allEvents()
  );

  onFilter(category: BabyEventCategory) {
    if (category === this.currentFilteredCategory()) {
      this.onUnfilter();
      return;
    }

    this.currentFilteredCategory.set(category);
  }

  onUnfilter() {
    this.currentFilteredCategory.set(null);
  }
}
