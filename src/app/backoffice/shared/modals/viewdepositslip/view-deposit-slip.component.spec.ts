import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDepositSlipComponent } from './view-deposit-slip.component';

describe('ViewDepositSlipComponent', () => {
  let component: ViewDepositSlipComponent;
  let fixture: ComponentFixture<ViewDepositSlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewDepositSlipComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDepositSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
