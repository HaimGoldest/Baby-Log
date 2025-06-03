import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-alert-message',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss'],
})
export class AlertMessageComponent {
  @Input() type: 'success' | 'error' | 'info' = 'info';
  @Input() title = '';
  @Input() message = '';
}
