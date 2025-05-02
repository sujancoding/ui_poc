import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSummaryReportComponent } from './transaction-summary-report.component';

describe('TransactionSummaryReportComponent', () => {
  let component: TransactionSummaryReportComponent;
  let fixture: ComponentFixture<TransactionSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
