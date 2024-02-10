import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyActionsInfoComponent } from './baby-actions-info.component';

describe('BabyActionsInfoComponent', () => {
  let component: BabyActionsInfoComponent;
  let fixture: ComponentFixture<BabyActionsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BabyActionsInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BabyActionsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
