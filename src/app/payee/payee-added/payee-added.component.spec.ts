import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayeeAddedComponent } from './payee-added.component';

describe('PayeeAddedComponent', () => {
  let component: PayeeAddedComponent;
  let fixture: ComponentFixture<PayeeAddedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayeeAddedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayeeAddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
