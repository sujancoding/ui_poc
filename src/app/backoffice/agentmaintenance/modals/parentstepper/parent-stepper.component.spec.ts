import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentStepperComponent } from './parent-stepper.component';

describe('ParentStepperComponent', () => {
  let component: ParentStepperComponent;
  let fixture: ComponentFixture<ParentStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentStepperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
