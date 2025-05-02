import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyStockComponent } from './currency-stock.component';

describe('CurrencyStockComponent', () => {
  let component: CurrencyStockComponent;
  let fixture: ComponentFixture<CurrencyStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
