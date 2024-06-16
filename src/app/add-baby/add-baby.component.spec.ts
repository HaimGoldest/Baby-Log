import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBabyComponent } from './add-baby.component';

describe('AddBabyComponent', () => {
  let component: AddBabyComponent;
  let fixture: ComponentFixture<AddBabyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddBabyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddBabyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
