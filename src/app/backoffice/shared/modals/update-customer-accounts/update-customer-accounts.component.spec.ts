import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCustomerAccountsComponent } from './update-customer-accounts.component';

describe('UpdateCustomerAccountsComponent', () => {
  let component: UpdateCustomerAccountsComponent;
  let fixture: ComponentFixture<UpdateCustomerAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCustomerAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCustomerAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
