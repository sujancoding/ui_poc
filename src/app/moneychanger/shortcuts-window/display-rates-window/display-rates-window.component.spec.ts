import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayRatesWindowComponent } from './display-rates-window.component';

describe('DisplayRatesWindowComponent', () => {
  let component: DisplayRatesWindowComponent;
  let fixture: ComponentFixture<DisplayRatesWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayRatesWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayRatesWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
