import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerTransferReceiptComponent } from './consumer-transfer-receipt.component';

describe('ConsumerTransferReceiptComponent', () => {
  let component: ConsumerTransferReceiptComponent;
  let fixture: ComponentFixture<ConsumerTransferReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumerTransferReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerTransferReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
