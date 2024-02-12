import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthTrackingComponent } from './growth-tracking.component';

describe('GrowthTrackingComponent', () => {
  let component: GrowthTrackingComponent;
  let fixture: ComponentFixture<GrowthTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrowthTrackingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrowthTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
