import { Component } from '@angular/core';
import { BabyActionModel } from '../../models/bayby-action.model';

@Component({
  selector: 'app-baby-actions-panel',
  templateUrl: './baby-actions-panel.component.html',
  styleUrl: './baby-actions-panel.component.css',
})
export class BabyActionsPanelComponent {
  babyActions: BabyActionModel[] = [
    new BabyActionModel(
      'Bottle',
      null,
      'temp..',
      '../../assets/images/icons8-baby-bottle-96.png'
    ),
    new BabyActionModel(
      'Poo',
      null,
      'temp..',
      '../../assets/images/icons8-pile-of-poo-3d-fluency-96.png'
    ),
    new BabyActionModel(
      'Shower',
      null,
      'temp..',
      '../../assets/images/icons8-shower-96.png'
    ),
    new BabyActionModel(
      'Awake',
      null,
      'temp..',
      '../../assets/images/icons8-sun-96.png'
    ),
    new BabyActionModel(
      'Sleep',
      null,
      'temp..',
      '../../assets/images/icons8-moon-96.png'
    ),
    new BabyActionModel(
      'Fever',
      null,
      'temp..',
      '../../assets/images/icons8-thermometer-96.png'
    ),
    new BabyActionModel(
      'Medication',
      null,
      'temp..',
      '../../assets/images/icons8-pill-96.png'
    ),
    new BabyActionModel(
      'Vomit',
      null,
      'temp..',
      '../../assets/images/icons8-face-vomiting-96.png'
    ),
  ];
}
