import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import SyncPendingIconStrings from './sync-pending-icon.strings';

/**
 * Marks an item that is shown from the local cache but not yet acknowledged
 * by the server, e.g. an event added while offline.
 *
 * The label lives on the host: `mat-icon` hides itself from assistive
 * technology by default.
 */
@Component({
  selector: 'app-sync-pending-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  templateUrl: './sync-pending-icon.component.html',
  styleUrl: './sync-pending-icon.component.scss',
  host: {
    role: 'img',
    '[attr.aria-label]': 'strings.WAITING_FOR_SYNC',
    '[attr.title]': 'strings.WAITING_FOR_SYNC',
  },
})
export class SyncPendingIconComponent {
  public readonly strings = SyncPendingIconStrings;
}
