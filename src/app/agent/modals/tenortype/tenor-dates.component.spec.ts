import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenorDatesComponent } from './tenor-dates.component';

describe('TenorDatesComponent', () => {
  let component: TenorDatesComponent;
  let fixture: ComponentFixture<TenorDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenorDatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenorDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
