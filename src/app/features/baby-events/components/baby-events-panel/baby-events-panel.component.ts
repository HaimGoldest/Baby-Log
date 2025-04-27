import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { BabyEventsPanelItemComponent } from './baby-events-panel-item/baby-events-panel-item.component';
import { BabyEventCategory } from '../../../../models/baby.model';
import { BabyEventPreferencesService } from '../../services/baby-event-preferences.service';

@Component({
  selector: 'app-baby-events-panel',
  standalone: true,
  imports: [CommonModule, BabyEventsPanelItemComponent],
  templateUrl: './baby-events-panel.component.html',
  styleUrl: './baby-events-panel.component.scss',
})
export class BabyActionsPanelComponent {
  private preferencesService = inject(BabyEventPreferencesService);
  public activeBabyEventCategories: BabyEventCategory[] =
    this.preferencesService.preferences().filter((p) => p.isCategoryEnabled);
  @Output() filter = new EventEmitter<BabyEventCategory>();

  public onFilter(category: BabyEventCategory): void {
    this.filter.emit(category);
  }
}
