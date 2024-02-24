import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthTrackingHeadMeasureComponent } from './growth-tracking-head-measure.component';

describe('GrowthTrackingHeadMeasureComponent', () => {
  let component: GrowthTrackingHeadMeasureComponent;
  let fixture: ComponentFixture<GrowthTrackingHeadMeasureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrowthTrackingHeadMeasureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrowthTrackingHeadMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
