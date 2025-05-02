import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateDealSendMoneyComponent } from './corporate-deal-send-money.component';

describe('CorporateDealSendMoneyComponent', () => {
  let component: CorporateDealSendMoneyComponent;
  let fixture: ComponentFixture<CorporateDealSendMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateDealSendMoneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateDealSendMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
