import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAccountsWindowComponent } from './customer-accounts-window.component';

describe('CustomerAccountsWindowComponent', () => {
  let component: CustomerAccountsWindowComponent;
  let fixture: ComponentFixture<CustomerAccountsWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerAccountsWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAccountsWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
