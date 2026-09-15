import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { BabyEventsPanelItemComponent } from './baby-events-panel-item/baby-events-panel-item.component';
import { BabyEventCategory } from '../../../../models/baby.model';
import { SessionStore } from '../../../../core/stores/session/session.store';

@Component({
  selector: 'app-baby-events-panel',
  templateUrl: './baby-events-panel.component.html',
  styleUrl: './baby-events-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [BabyEventsPanelItemComponent],
})
export class BabyEventsPanelComponent {
  private sessionStore = inject(SessionStore);

  public activeBabyEventCategories = this.sessionStore.panelCategories;

  @Output() filter = new EventEmitter<BabyEventCategory>();

  public onFilter(category: BabyEventCategory): void {
    this.filter.emit(category);
  }
}
