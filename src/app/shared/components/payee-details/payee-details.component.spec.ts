import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayeeDetailsComponent } from './payee-details.component';

describe('PayeeDetailsComponent', () => {
  let component: PayeeDetailsComponent;
  let fixture: ComponentFixture<PayeeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayeeDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayeeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
