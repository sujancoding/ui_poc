import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionsCustomerComponent } from './promotions-customer.component';

describe('PromotionsCustomerComponent', () => {
  let component: PromotionsCustomerComponent;
  let fixture: ComponentFixture<PromotionsCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromotionsCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionsCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
