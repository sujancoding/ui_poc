import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateDealReviewTransactionComponent } from './corporate-deal-review-transaction.component';

describe('CorporateDealReviewTransactionComponent', () => {
  let component: CorporateDealReviewTransactionComponent;
  let fixture: ComponentFixture<CorporateDealReviewTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateDealReviewTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateDealReviewTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
