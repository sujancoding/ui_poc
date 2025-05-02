import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealBookingComponent } from './deal-booking.component';

describe('DealBookingComponent', () => {
  let component: DealBookingComponent;
  let fixture: ComponentFixture<DealBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealBookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
