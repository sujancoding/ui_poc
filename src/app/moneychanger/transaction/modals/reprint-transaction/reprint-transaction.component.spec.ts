import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReprintTransactionComponent } from './reprint-transaction.component';

describe('ReprintTransactionComponent', () => {
  let component: ReprintTransactionComponent;
  let fixture: ComponentFixture<ReprintTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReprintTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReprintTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
