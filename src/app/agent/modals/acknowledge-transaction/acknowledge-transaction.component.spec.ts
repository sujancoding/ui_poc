import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgeTransactionComponent } from './acknowledge-transaction.component';

describe('AcknowledgeTransactionComponent', () => {
  let component: AcknowledgeTransactionComponent;
  let fixture: ComponentFixture<AcknowledgeTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcknowledgeTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcknowledgeTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
