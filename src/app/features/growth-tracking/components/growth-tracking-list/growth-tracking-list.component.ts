import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BabyMeasurementsService } from '../../services/baby-measurements.service';
import { GrowthTrackingListItemComponent } from './growth-tracking-list-item/growth-tracking-list-item.component';
import GrowthTrackingListStrings from './growth-tracking-list.strings';

@Component({
  selector: 'app-growth-tracking-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [GrowthTrackingListItemComponent],
  templateUrl: './growth-tracking-list.component.html',
  styleUrl: './growth-tracking-list.component.scss',
})
export class GrowthTrackingListComponent {
  private readonly babyMeasurementsService = inject(BabyMeasurementsService);

  public readonly measurements = this.babyMeasurementsService.measurements;
  public strings = GrowthTrackingListStrings;
}
