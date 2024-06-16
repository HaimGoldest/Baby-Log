import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyInfoComponent } from './baby-info.component';

describe('BabyInfoComponent', () => {
  let component: BabyInfoComponent;
  let fixture: ComponentFixture<BabyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BabyInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BabyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
