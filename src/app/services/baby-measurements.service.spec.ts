import { TestBed } from '@angular/core/testing';

import { BabyMeasurementsService } from './baby-measurements.service';

describe('BabyMeasurementsService', () => {
  let service: BabyMeasurementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BabyMeasurementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
