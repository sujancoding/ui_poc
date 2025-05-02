import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateExchangeratesComponent } from './corporate-exchangerates.component';

describe('CorporateExchangeratesComponent', () => {
  let component: CorporateExchangeratesComponent;
  let fixture: ComponentFixture<CorporateExchangeratesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateExchangeratesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateExchangeratesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
