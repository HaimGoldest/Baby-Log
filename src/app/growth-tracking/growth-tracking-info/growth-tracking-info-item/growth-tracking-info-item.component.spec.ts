import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthTrackingInfoItemComponent } from './growth-tracking-info-item.component';

describe('GrowthTrackingInfoItemComponent', () => {
  let component: GrowthTrackingInfoItemComponent;
  let fixture: ComponentFixture<GrowthTrackingInfoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrowthTrackingInfoItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrowthTrackingInfoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
