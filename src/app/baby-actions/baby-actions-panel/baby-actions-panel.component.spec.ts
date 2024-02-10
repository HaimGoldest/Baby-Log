import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyActionsPanelComponent } from './baby-actions-panel.component';

describe('BabyActionsPanelComponent', () => {
  let component: BabyActionsPanelComponent;
  let fixture: ComponentFixture<BabyActionsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BabyActionsPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BabyActionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
