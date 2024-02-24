import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthTrackingHeightComponent } from './growth-tracking-height.component';

describe('GrowthTrackingHeightComponent', () => {
  let component: GrowthTrackingHeightComponent;
  let fixture: ComponentFixture<GrowthTrackingHeightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrowthTrackingHeightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrowthTrackingHeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
