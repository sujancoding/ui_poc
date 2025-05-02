import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayRatesComponent } from './display-rates.component';

describe('DisplayRatesComponent', () => {
  let component: DisplayRatesComponent;
  let fixture: ComponentFixture<DisplayRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayRatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
