import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyActionsComponent } from './baby-actions.component';

describe('BabyActionsComponent', () => {
  let component: BabyActionsComponent;
  let fixture: ComponentFixture<BabyActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BabyActionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BabyActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
