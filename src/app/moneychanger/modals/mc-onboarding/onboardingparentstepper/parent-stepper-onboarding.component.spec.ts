import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentStepperOnboardingComponent } from './parent-stepper-onboarding.component';

describe('ParentStepperOnboardingComponent', () => {
  let component: ParentStepperOnboardingComponent;
  let fixture: ComponentFixture<ParentStepperOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentStepperOnboardingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentStepperOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
