import { TestBed } from '@angular/core/testing';

import { BabiesService } from './babies.service';

describe('BabiesService', () => {
  let service: BabiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BabiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
