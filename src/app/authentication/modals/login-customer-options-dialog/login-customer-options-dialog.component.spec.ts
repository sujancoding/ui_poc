import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCustomerOptionsDialogComponent } from './login-customer-options-dialog.component';

describe('LoginCustomerOptionsDialogComponent', () => {
  let component: LoginCustomerOptionsDialogComponent;
  let fixture: ComponentFixture<LoginCustomerOptionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginCustomerOptionsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginCustomerOptionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
