import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTransactionMcComponent } from './view-transaction-mc.component';

describe('ViewTransactionMcComponent', () => {
  let component: ViewTransactionMcComponent;
  let fixture: ComponentFixture<ViewTransactionMcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTransactionMcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTransactionMcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
