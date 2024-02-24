import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-growth-tracking',
  templateUrl: './growth-tracking.component.html',
  styleUrl: './growth-tracking.component.css',
})
export class GrowthTrackingComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  navigate() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
