import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyActionsPreferencesComponent } from './baby-actions-preferences.component';

describe('BabyActionsPreferencesComponent', () => {
  let component: BabyActionsPreferencesComponent;
  let fixture: ComponentFixture<BabyActionsPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BabyActionsPreferencesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BabyActionsPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
