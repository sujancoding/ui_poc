import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateExchangerateComponent } from './corporate-exchangerate.component';

describe('CorporateExchangerateComponent', () => {
  let component: CorporateExchangerateComponent;
  let fixture: ComponentFixture<CorporateExchangerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateExchangerateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateExchangerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
