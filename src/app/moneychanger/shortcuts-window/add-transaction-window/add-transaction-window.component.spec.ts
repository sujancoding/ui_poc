import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransactionWindowComponent } from './add-transaction-window.component';

describe('AddTransactionWindowComponent', () => {
  let component: AddTransactionWindowComponent;
  let fixture: ComponentFixture<AddTransactionWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTransactionWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTransactionWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
