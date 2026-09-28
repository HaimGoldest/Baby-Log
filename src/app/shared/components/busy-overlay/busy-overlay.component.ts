import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import BusyOverlayStrings from './busy-overlay.strings';

/**
 * Dims and locks its nearest positioned ancestor, such as a `mat-card`, while
 * a write for it is in flight. It covers the ancestor, so clicks never reach
 * the controls underneath.
 *
 * The local counterpart of `LoadingSpinnerComponent`, which covers the whole
 * app.
 */
@Component({
  selector: 'app-busy-overlay',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinnerModule],
  templateUrl: './busy-overlay.component.html',
  styleUrl: './busy-overlay.component.scss',
})
export class BusyOverlayComponent {
  public readonly diameter = input(36);

  public readonly strings = BusyOverlayStrings;
}
