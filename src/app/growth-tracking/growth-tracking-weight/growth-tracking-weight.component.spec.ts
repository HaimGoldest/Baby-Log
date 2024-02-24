import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthTrackingWeightComponent } from './growth-tracking-weight.component';

describe('GrowthTrackingWeightComponent', () => {
  let component: GrowthTrackingWeightComponent;
  let fixture: ComponentFixture<GrowthTrackingWeightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrowthTrackingWeightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrowthTrackingWeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
