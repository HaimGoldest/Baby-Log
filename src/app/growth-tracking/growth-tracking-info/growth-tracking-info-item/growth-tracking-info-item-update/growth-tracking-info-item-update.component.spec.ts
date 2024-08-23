import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthTrackingInfoItemUpdateComponent } from './growth-tracking-info-item-update.component';

describe('GrowthTrackingInfoItemUpdateComponent', () => {
  let component: GrowthTrackingInfoItemUpdateComponent;
  let fixture: ComponentFixture<GrowthTrackingInfoItemUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrowthTrackingInfoItemUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrowthTrackingInfoItemUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
