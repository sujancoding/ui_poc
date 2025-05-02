import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSuspiciousRemarksComponent } from './transaction-suspicious-remarks.component';

describe('TransactionSuspiciousRemarksComponent', () => {
  let component: TransactionSuspiciousRemarksComponent;
  let fixture: ComponentFixture<TransactionSuspiciousRemarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionSuspiciousRemarksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionSuspiciousRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
