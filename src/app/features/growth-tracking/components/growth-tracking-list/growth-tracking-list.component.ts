import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BabyMeasurementsService } from '../../services/baby-measurements.service';
import { GrowthTrackingListItemComponent } from './growth-tracking-list-item/growth-tracking-list-item.component';
import GrowthTrackingListStrings from './growth-tracking-list.strings';
import { AlertMessageComponent } from '../../../../shared/components/alert-message/alert-message.component';

@Component({
  selector: 'app-growth-tracking-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [GrowthTrackingListItemComponent, AlertMessageComponent],
  templateUrl: './growth-tracking-list.component.html',
  styleUrl: './growth-tracking-list.component.scss',
})
export class GrowthTrackingListComponent {
  private readonly babyMeasurementsService = inject(BabyMeasurementsService);

  public readonly measurements = this.babyMeasurementsService.measurements;
  public strings = GrowthTrackingListStrings;
}
