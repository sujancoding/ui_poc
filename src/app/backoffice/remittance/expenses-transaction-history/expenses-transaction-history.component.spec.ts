import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesTransactionHistoryComponent } from './expenses-transaction-history.component';

describe('ExpensesTransactionHistoryComponent', () => {
  let component: ExpensesTransactionHistoryComponent;
  let fixture: ComponentFixture<ExpensesTransactionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpensesTransactionHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesTransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
