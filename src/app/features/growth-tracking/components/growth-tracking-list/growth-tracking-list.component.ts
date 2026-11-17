import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BabyMeasurementsService } from '../../services/baby-measurements.service';
import { GrowthTrackingListItemComponent } from './growth-tracking-list-item/growth-tracking-list-item.component';
import GrowthTrackingListStrings from './growth-tracking-list.strings';
import { AlertMessageComponent } from '../../../../shared/components/alert-message/alert-message.component';

/**
 * The measurements as one table: a single header row names the columns, and
 * each `GrowthTrackingListItemComponent` is a row beneath it. Both lay their
 * cells out on the `--growth-columns` grid defined here, so they stay aligned.
 */
@Component({
  selector: 'app-growth-tracking-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AlertMessageComponent,
    GrowthTrackingListItemComponent,
    MatCardModule,
  ],
  templateUrl: './growth-tracking-list.component.html',
  styleUrl: './growth-tracking-list.component.scss',
})
export class GrowthTrackingListComponent {
  private readonly babyMeasurementsService = inject(BabyMeasurementsService);

  public readonly measurements = this.babyMeasurementsService.measurements;
  public strings = GrowthTrackingListStrings;
}
