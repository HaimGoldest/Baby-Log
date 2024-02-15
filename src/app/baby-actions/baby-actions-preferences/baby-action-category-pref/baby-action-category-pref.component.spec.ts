import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyActionCategoryPrefComponent } from './baby-action-category-pref.component';

describe('BabyActionCategoryPrefComponent', () => {
  let component: BabyActionCategoryPrefComponent;
  let fixture: ComponentFixture<BabyActionCategoryPrefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BabyActionCategoryPrefComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BabyActionCategoryPrefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
