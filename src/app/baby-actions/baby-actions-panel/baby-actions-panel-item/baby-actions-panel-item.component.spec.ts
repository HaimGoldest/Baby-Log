import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyActionsPanelItemComponent } from './baby-actions-panel-item.component';

describe('BabyActionsPanelItemComponent', () => {
  let component: BabyActionsPanelItemComponent;
  let fixture: ComponentFixture<BabyActionsPanelItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BabyActionsPanelItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BabyActionsPanelItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
