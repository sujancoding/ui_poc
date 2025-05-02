import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTransactionAckDetailsComponent } from './view-transaction-ack-details.component';

describe('ViewTransactionAckDetailsComponent', () => {
  let component: ViewTransactionAckDetailsComponent;
  let fixture: ComponentFixture<ViewTransactionAckDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTransactionAckDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTransactionAckDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
