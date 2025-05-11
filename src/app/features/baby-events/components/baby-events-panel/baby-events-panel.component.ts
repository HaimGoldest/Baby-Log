import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { BabyEventsPanelItemComponent } from './baby-events-panel-item/baby-events-panel-item.component';
import { BabyEventCategory } from '../../../../models/baby.model';
import { BabyEventPreferencesService } from '../../services/baby-event-preferences.service';

@Component({
  selector: 'app-baby-events-panel',
  templateUrl: './baby-events-panel.component.html',
  styleUrl: './baby-events-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, BabyEventsPanelItemComponent],
})
export class BabyEventsPanelComponent {
  private preferencesService = inject(BabyEventPreferencesService);
  public activeBabyEventCategories: BabyEventCategory[] =
    this.preferencesService.preferences().filter((p) => p.isCategoryEnabled);
  @Output() filter = new EventEmitter<BabyEventCategory>();

  public onFilter(category: BabyEventCategory): void {
    this.filter.emit(category);
  }
}
