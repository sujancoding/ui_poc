import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessReceiptAdminComponent } from './success-receipt-admin.component';

describe('SuccessReceiptAdminComponent', () => {
  let component: SuccessReceiptAdminComponent;
  let fixture: ComponentFixture<SuccessReceiptAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessReceiptAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessReceiptAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
