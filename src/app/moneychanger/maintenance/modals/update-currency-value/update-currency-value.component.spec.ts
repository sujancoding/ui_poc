import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCurrencyValueComponent } from './update-currency-value.component';

describe('UpdateCurrencyValueComponent', () => {
  let component: UpdateCurrencyValueComponent;
  let fixture: ComponentFixture<UpdateCurrencyValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCurrencyValueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCurrencyValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
