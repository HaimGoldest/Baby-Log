import { Component } from '@angular/core';
import { BabyEventsPanelComponent } from '../components/baby-events-panel/baby-events-panel.component';

@Component({
  selector: 'app-baby-events',
  standalone: true,
  imports: [BabyEventsPanelComponent],
  templateUrl: './baby-events.page.html',
  styleUrl: './baby-events.page.scss',
})
export class BabyEventsComponent {}
