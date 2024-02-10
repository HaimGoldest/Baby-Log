import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyActionsInfoItemComponent } from './baby-actions-info-item.component';

describe('BabyActionsInfoItemComponent', () => {
  let component: BabyActionsInfoItemComponent;
  let fixture: ComponentFixture<BabyActionsInfoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BabyActionsInfoItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BabyActionsInfoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
