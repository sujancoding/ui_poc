import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSettlementComponent } from './new-settlement.component';

describe('NewSettlementComponent', () => {
  let component: NewSettlementComponent;
  let fixture: ComponentFixture<NewSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSettlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
