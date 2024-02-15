import { TestBed } from '@angular/core/testing';

import { BabyActionCategoriesService } from './baby-actions-categories.service';

describe('BabyActionCategoriesService', () => {
  let service: BabyActionCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BabyActionCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
