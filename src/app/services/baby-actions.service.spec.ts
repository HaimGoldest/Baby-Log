import { TestBed } from '@angular/core/testing';

import { BabyActionsService } from './baby-actions.service';

describe('BabyActionsService', () => {
  let service: BabyActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BabyActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
