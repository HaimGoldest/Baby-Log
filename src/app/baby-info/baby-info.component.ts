import { Component } from '@angular/core';
import { BabiesService } from '../services/babies.service';

@Component({
  selector: 'app-baby-info',
  templateUrl: './baby-info.component.html',
  styleUrl: './baby-info.component.css',
})
export class BabyInfoComponent {
  uid: string;
  name: string;
  birthDate: Date;

  constructor(private babiesService: BabiesService) {
    this.uid = this.babiesService.babyData.value.uid;
    this.name = this.babiesService.babyData.value.name;
    this.birthDate = this.babiesService.babyData.value.birthDate;
  }
}
