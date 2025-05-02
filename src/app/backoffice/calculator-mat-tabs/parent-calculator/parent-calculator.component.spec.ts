import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentCalculatorComponent } from './parent-calculator.component';

describe('ParentCalculatorComponent', () => {
  let component: ParentCalculatorComponent;
  let fixture: ComponentFixture<ParentCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentCalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
