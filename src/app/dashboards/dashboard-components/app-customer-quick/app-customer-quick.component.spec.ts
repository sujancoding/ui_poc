import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCustomerQuickComponent } from './app-customer-quick.component';

describe('AppCustomerQuickComponent', () => {
  let component: AppCustomerQuickComponent;
  let fixture: ComponentFixture<AppCustomerQuickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppCustomerQuickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCustomerQuickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
