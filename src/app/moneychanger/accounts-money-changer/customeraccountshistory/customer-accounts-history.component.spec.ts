import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAccountsHistoryComponent } from './customer-accounts-history.component';

describe('CustomerAccountsHistoryComponent', () => {
  let component: CustomerAccountsHistoryComponent;
  let fixture: ComponentFixture<CustomerAccountsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerAccountsHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAccountsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
