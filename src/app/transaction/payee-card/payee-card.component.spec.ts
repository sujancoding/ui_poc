import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayeeCardComponent } from './payee-card.component';

describe('PayeeCardComponent', () => {
  let component: PayeeCardComponent;
  let fixture: ComponentFixture<PayeeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayeeCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayeeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
