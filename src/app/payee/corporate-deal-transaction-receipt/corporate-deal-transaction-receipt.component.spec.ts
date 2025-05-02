import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateDealTransactionReceiptComponent } from './corporate-deal-transaction-receipt.component';

describe('CorporateDealTransactionReceiptComponent', () => {
  let component: CorporateDealTransactionReceiptComponent;
  let fixture: ComponentFixture<CorporateDealTransactionReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateDealTransactionReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateDealTransactionReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
