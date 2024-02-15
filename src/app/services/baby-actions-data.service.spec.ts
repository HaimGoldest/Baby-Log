import { TestBed } from '@angular/core/testing';

import { BabyActionsDataService } from './baby-actions-data.service';

describe('BabyActionsDataService', () => {
  let service: BabyActionsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BabyActionsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
