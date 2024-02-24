import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthTrackingNewMeasurementComponent } from './growth-tracking-new-measurement.component';

describe('GrowthTrackingNewMeasurementComponent', () => {
  let component: GrowthTrackingNewMeasurementComponent;
  let fixture: ComponentFixture<GrowthTrackingNewMeasurementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrowthTrackingNewMeasurementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrowthTrackingNewMeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
