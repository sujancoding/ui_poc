import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemitMoneyComponent } from './remit-money.component';

describe('RemitMoneyComponent', () => {
  let component: RemitMoneyComponent;
  let fixture: ComponentFixture<RemitMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemitMoneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemitMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
