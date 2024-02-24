import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthTrackingInfoComponent } from './growth-tracking-info.component';

describe('GrowthTrackingInfoComponent', () => {
  let component: GrowthTrackingInfoComponent;
  let fixture: ComponentFixture<GrowthTrackingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrowthTrackingInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrowthTrackingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
